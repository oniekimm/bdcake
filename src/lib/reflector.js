import * as THREE from 'three';
import frag from './reflector.frag';

const Reflector = function(geometry, options) {
    THREE.Mesh.call(this, geometry);

    this.type = 'Reflector';

    var scope = this;

    options = options || {};

    var color = options.color !== undefined ? new THREE.Color(options.color) : new THREE.Color(0x7f7f7f);
    var color2 = options.color2 !== undefined ? new THREE.Color(options.color2) : new THREE.Color(0x7f7f7f);

    var textureWidth = options.textureWidth || 512;
    var textureHeight = options.textureHeight || 512;
    var clipBias = options.clipBias || 0;
    var shader = options.shader || Reflector.ReflectorShader;

    //

    var reflectorPlane = new THREE.Plane();
    var normal = new THREE.Vector3();
    var reflectorWorldPosition = new THREE.Vector3();
    var cameraWorldPosition = new THREE.Vector3();
    var rotationMatrix = new THREE.Matrix4();
    var lookAtPosition = new THREE.Vector3(0, 0, -1);
    var clipPlane = new THREE.Vector4();
    var viewport = new THREE.Vector4();

    var view = new THREE.Vector3();
    var target = new THREE.Vector3();
    var q = new THREE.Vector4();

    var textureMatrix = new THREE.Matrix4();
    var virtualCamera = new THREE.PerspectiveCamera();

    var parameters = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat,
        stencilBuffer: false
    };

    var renderTarget = new THREE.WebGLRenderTarget(textureWidth, textureHeight, parameters);

    renderTarget.depthBuffer = true;
    renderTarget.depthTexture = new THREE.DepthTexture();
    renderTarget.depthTexture.type = THREE.UnsignedShortType;

    if (!THREE.Math.isPowerOfTwo(textureWidth) || !THREE.Math.isPowerOfTwo(textureHeight)) {
        renderTarget.texture.generateMipmaps = false;
    }

    var material = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.clone(shader.uniforms),
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader
        // transparent: true
    });

    material.uniforms.tDiffuse.value = renderTarget.texture;
    material.uniforms.tDepth.value = renderTarget.depthTexture;
    material.uniforms.color.value = color;
    material.uniforms.color2.value = color2;
    material.uniforms.textureMatrix.value = textureMatrix;
    material.uniforms.reflectionOpacity.value = options.reflectionOpacity;

    this.material = material;

    this.render = function({ renderer, scene, camera }) {
        reflectorWorldPosition.setFromMatrixPosition(scope.matrixWorld);
        cameraWorldPosition.setFromMatrixPosition(camera.matrixWorld);

        rotationMatrix.extractRotation(scope.matrixWorld);

        normal.set(0, 0, 1);
        normal.applyMatrix4(rotationMatrix);

        view.subVectors(reflectorWorldPosition, cameraWorldPosition);

        // Avoid rendering when reflector is facing away

        if (view.dot(normal) > 0) return;

        view.reflect(normal).negate();
        view.add(reflectorWorldPosition);

        rotationMatrix.extractRotation(camera.matrixWorld);

        lookAtPosition.set(0, 0, -1);
        lookAtPosition.applyMatrix4(rotationMatrix);
        lookAtPosition.add(cameraWorldPosition);

        target.subVectors(reflectorWorldPosition, lookAtPosition);
        target.reflect(normal).negate();
        target.add(reflectorWorldPosition);

        virtualCamera.position.copy(view);
        virtualCamera.up.set(0, 1, 0);
        virtualCamera.up.applyMatrix4(rotationMatrix);
        virtualCamera.up.reflect(normal);
        virtualCamera.lookAt(target);

        virtualCamera.far = camera.far; // Used in WebGLBackground

        virtualCamera.updateMatrixWorld();
        virtualCamera.projectionMatrix.copy(camera.projectionMatrix);

        this.material.uniforms.cameraNear.value = camera.near;
        this.material.uniforms.cameraFar.value = camera.far;

        // Update the texture matrix
        textureMatrix.set(0.5, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 1.0);
        textureMatrix.multiply(virtualCamera.projectionMatrix);
        textureMatrix.multiply(virtualCamera.matrixWorldInverse);
        textureMatrix.multiply(scope.matrixWorld);

        // Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
        // Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
        reflectorPlane.setFromNormalAndCoplanarPoint(normal, reflectorWorldPosition);
        reflectorPlane.applyMatrix4(virtualCamera.matrixWorldInverse);

        clipPlane.set(
            reflectorPlane.normal.x,
            reflectorPlane.normal.y,
            reflectorPlane.normal.z,
            reflectorPlane.constant
        );

        var projectionMatrix = virtualCamera.projectionMatrix;

        q.x = (Math.sign(clipPlane.x) + projectionMatrix.elements[8]) / projectionMatrix.elements[0];
        q.y = (Math.sign(clipPlane.y) + projectionMatrix.elements[9]) / projectionMatrix.elements[5];
        q.z = -1.0;
        q.w = (1.0 + projectionMatrix.elements[10]) / projectionMatrix.elements[14];

        // Calculate the scaled plane vector
        clipPlane.multiplyScalar(2.0 / clipPlane.dot(q));

        // Replacing the third row of the projection matrix
        projectionMatrix.elements[2] = clipPlane.x;
        projectionMatrix.elements[6] = clipPlane.y;
        projectionMatrix.elements[10] = clipPlane.z + 1.0 - clipBias;
        projectionMatrix.elements[14] = clipPlane.w;

        // Render

        renderTarget.texture.encoding = renderer.outputEncoding;

        scope.visible = false;

        var currentRenderTarget = renderer.getRenderTarget();

        var currentXrEnabled = renderer.xr.enabled;
        var currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;

        renderer.xr.enabled = false; // Avoid camera modification
        renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows

        renderer.setRenderTarget(renderTarget);

        renderer.state.buffers.depth.setMask(true); // make sure the depth buffer is writable so it can be properly cleared, see #18897

        if (renderer.autoClear === false) renderer.clear();
        renderer.render(scene, virtualCamera);

        renderer.xr.enabled = currentXrEnabled;
        renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;

        renderer.setRenderTarget(currentRenderTarget);
        // Restore viewport

        var bounds = camera.bounds;

        if (bounds !== undefined) {
            var size = renderer.getSize();
            var pixelRatio = renderer.getPixelRatio();

            viewport.x = bounds.x * size.width * pixelRatio;
            viewport.y = bounds.y * size.height * pixelRatio;
            viewport.z = bounds.z * size.width * pixelRatio;
            viewport.w = bounds.w * size.height * pixelRatio;

            renderer.state.viewport(viewport);
        }

        scope.visible = true;
    };

    this.getRenderTarget = function() {
        return renderTarget;
    };

    this.getTextureMatrix = function() {
        return textureMatrix;
    };
};

Reflector.prototype = Object.create(THREE.Mesh.prototype);
Reflector.prototype.constructor = THREE.Reflector;

Reflector.ReflectorShader = {
    uniforms: {
        color: {
            type: 'c',
            value: null
        },

        color: {
            type: 'c',
            value: null
        },
        color2: {
            type: 'c',
            value: null
        },

        tDiffuse: {
            type: 't',
            value: null
        },

        tDepth: {
            type: 't',
            value: null
        },

        textureMatrix: {
            type: 'm4',
            value: null
        },

        cameraNear: {
            type: 'f',
            value: 0
        },

        cameraFar: {
            type: 'f',
            value: 0
        },
        reflectionOpacity: {
            type: 'f',
            value: 0.5
        }
    },

    vertexShader: `
        uniform mat4 textureMatrix;
        varying vec2 vUv;
        varying vec4 rUv;

        void main() {
        	vUv = position.xy;

        	rUv = textureMatrix * vec4( position, 1.0 );

        	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

        }
    `,
    fragmentShader: frag
};

export default Reflector;
