(this.webpackJsonpwebgl=this.webpackJsonpwebgl||[]).push([[0],{10:function(e,t,r){e.exports=r(16)},15:function(e,t,r){},16:function(e,t,r){"use strict";r.r(t);var i=r(3),n=r.n(i),a=r(6),o=r.n(a),c=(r(15),r(1)),u=r(2),s=r(8),f=r(7),l=r(4),v=r(9),d=function(){function e(){Object(c.a)(this,e),this.initShaderProgram=this.initShaderProgram.bind(this),this.loadTexture=this.loadTexture.bind(this),this.clearScreen=this.clearScreen.bind(this)}return Object(u.a)(e,[{key:"initShaderProgram",value:function(e,t,r){var i=this._loadShader(e,e.VERTEX_SHADER,t),n=this._loadShader(e,e.FRAGMENT_SHADER,r),a=e.createProgram();return e.attachShader(a,i),e.attachShader(a,n),e.linkProgram(a),e.getProgramParameter(a,e.LINK_STATUS)?a:(alert("Unable to initialize the shader program: "+e.getProgramInfoLog(a)),null)}},{key:"_loadShader",value:function(e,t,r){var i=e.createShader(t);return e.shaderSource(i,r),e.compileShader(i),e.getShaderParameter(i,e.COMPILE_STATUS)?i:(alert("An error occurred compiling the shaders: "+e.getShaderInfoLog(i)),e.deleteShader(i),null)}},{key:"loadTexture",value:function(e,t){var r=this,i=e.createTexture();e.bindTexture(e.TEXTURE_2D,i);var n=e.RGBA,a=e.RGBA,o=e.UNSIGNED_BYTE,c=new Uint8Array([0,0,255,255]);e.texImage2D(e.TEXTURE_2D,0,n,1,1,0,a,o,c);var u=new Image;return u.onload=function(){e.bindTexture(e.TEXTURE_2D,i),e.texImage2D(e.TEXTURE_2D,0,n,a,o,u),r._isPowerOf2(u.width)&&r._isPowerOf2(u.height)?e.generateMipmap(e.TEXTURE_2D):(e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR))},u.src=t,i}},{key:"_isPowerOf2",value:function(e){return 0===(e&e-1)}},{key:"clearScreen",value:function(e){e.clearColor(0,0,0,1),e.clearDepth(1),e.enable(e.DEPTH_TEST),e.depthFunc(e.LEQUAL),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT)}}]),e}(),m=r(0),h=function(){function e(){Object(c.a)(this,e),this.utility=new d,this.initScene=this.initScene.bind(this),this.drawScene=this.drawScene.bind(this)}return Object(u.a)(e,[{key:"initScene",value:function(e){var t=this.utility.initShaderProgram(e,"\n    attribute vec4 aVertexPosition;\n    attribute vec4 aVertexColor;\n\n    uniform mat4 uModelViewMatrix;\n    uniform mat4 uProjectionMatrix;\n\n    varying lowp vec4 vColor;\n\n    void main(void) {\n      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;\n      vColor = aVertexColor;\n    }\n  ","\n    varying lowp vec4 vColor;\n\n    void main(void) {\n      gl_FragColor = vColor;\n    }\n  "),r={program:t,attribLocations:{vertexPosition:e.getAttribLocation(t,"aVertexPosition"),vertexColor:e.getAttribLocation(t,"aVertexColor")},uniformLocations:{projectionMatrix:e.getUniformLocation(t,"uProjectionMatrix"),modelViewMatrix:e.getUniformLocation(t,"uModelViewMatrix")}},i=this._initBuffers(e);this.scene={programInfo:r,buffers:i,squareRotation:0}}},{key:"drawScene",value:function(e,t){var r=this.scene,i=r.programInfo,n=r.buffers;this.utility.clearScreen(e);var a=e.FLOAT;e.bindBuffer(e.ARRAY_BUFFER,n.color),e.vertexAttribPointer(i.attribLocations.vertexColor,4,a,!1,0,0),e.enableVertexAttribArray(i.attribLocations.vertexColor);var o=e.FLOAT;e.bindBuffer(e.ARRAY_BUFFER,n.position),e.vertexAttribPointer(i.attribLocations.vertexPosition,2,o,!1,0,0),e.enableVertexAttribArray(i.attribLocations.vertexPosition);var c=45*Math.PI/180,u=e.canvas.clientWidth/e.canvas.clientHeight,s=m.a();m.d(s,c,u,.1,100);var f=m.a();m.f(f,f,[-0,0,-6]),m.e(f,f,r.squareRotation,[0,0,1]),e.useProgram(i.program),e.uniformMatrix4fv(i.uniformLocations.projectionMatrix,!1,s),e.uniformMatrix4fv(i.uniformLocations.modelViewMatrix,!1,f);e.drawArrays(e.TRIANGLE_STRIP,0,4),r.squareRotation+=t}},{key:"_initBuffers",value:function(e){var t=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,t),e.bufferData(e.ARRAY_BUFFER,new Float32Array([1,1,-1,1,1,-1,-1,-1]),e.STATIC_DRAW);var r=e.createBuffer();return e.bindBuffer(e.ARRAY_BUFFER,r),e.bufferData(e.ARRAY_BUFFER,new Float32Array([1,1,1,1,1,0,0,1,0,1,0,1,0,0,1,1]),e.STATIC_DRAW),{position:t,color:r}}}]),e}(),A=function(){function e(){Object(c.a)(this,e),this.utility=new d,this.initScene=this.initScene.bind(this),this.drawScene=this.drawScene.bind(this)}return Object(u.a)(e,[{key:"initScene",value:function(e){var t=this.utility.initShaderProgram(e,"\n    attribute vec4 aVertexPosition;\n    attribute vec4 aVertexColor;\n\n    uniform mat4 uModelViewMatrix;\n    uniform mat4 uProjectionMatrix;\n\n    varying lowp vec4 vColor;\n\n    void main(void) {\n      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;\n      vColor = aVertexColor;\n    }\n  ","\n    varying lowp vec4 vColor;\n\n    void main(void) {\n      gl_FragColor = vColor;\n    }\n  "),r={program:t,attribLocations:{vertexPosition:e.getAttribLocation(t,"aVertexPosition"),vertexColor:e.getAttribLocation(t,"aVertexColor")},uniformLocations:{projectionMatrix:e.getUniformLocation(t,"uProjectionMatrix"),modelViewMatrix:e.getUniformLocation(t,"uModelViewMatrix")}},i=this._initBuffers(e);this.scene={programInfo:r,buffers:i,cubeRotation:0}}},{key:"drawScene",value:function(e,t){var r=this.scene,i=r.programInfo,n=r.buffers;this.utility.clearScreen(e);var a=e.FLOAT;e.bindBuffer(e.ARRAY_BUFFER,n.position),e.vertexAttribPointer(i.attribLocations.vertexPosition,3,a,!1,0,0),e.enableVertexAttribArray(i.attribLocations.vertexPosition);var o=e.FLOAT;e.bindBuffer(e.ARRAY_BUFFER,n.color),e.vertexAttribPointer(i.attribLocations.vertexColor,4,o,!1,0,0),e.enableVertexAttribArray(i.attribLocations.vertexColor),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n.indices);var c=45*Math.PI/180,u=e.canvas.clientWidth/e.canvas.clientHeight,s=m.a();m.d(s,c,u,.1,100);var f=m.a();m.f(f,f,[-0,0,-6]),m.e(f,f,r.cubeRotation,[0,0,1]),m.e(f,f,.7*r.cubeRotation,[0,1,0]),e.useProgram(i.program),e.uniformMatrix4fv(i.uniformLocations.projectionMatrix,!1,s),e.uniformMatrix4fv(i.uniformLocations.modelViewMatrix,!1,f);var l=e.UNSIGNED_SHORT;e.drawElements(e.TRIANGLES,36,l,0),r.cubeRotation+=t}},{key:"_initBuffers",value:function(e){var t=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,t),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,1,-1,1,1,1,1,-1,1,1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1,-1,-1,1,-1,-1,1,1,1,1,1,1,1,-1,-1,-1,-1,1,-1,-1,1,-1,1,-1,-1,1,1,-1,-1,1,1,-1,1,1,1,1,-1,1,-1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1]),e.STATIC_DRAW);for(var r=[[1,1,1,1],[1,0,0,1],[0,1,0,1],[0,0,1,1],[1,1,0,1],[1,0,1,1]],i=[],n=0;n<r.length;++n){var a=r[n];i=i.concat(a,a,a,a)}var o=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,o),e.bufferData(e.ARRAY_BUFFER,new Float32Array(i),e.STATIC_DRAW);var c=e.createBuffer();return e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,c),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23]),e.STATIC_DRAW),{position:t,color:o,indices:c}}}]),e}(),x=function(){function e(){Object(c.a)(this,e),this.utility=new d,this.initScene=this.initScene.bind(this),this.drawScene=this.drawScene.bind(this)}return Object(u.a)(e,[{key:"initScene",value:function(e){var t=this.utility.initShaderProgram(e,"\n      attribute vec4 aVertexPosition;\n      attribute vec2 aTextureCoord;\n\n      uniform mat4 uModelViewMatrix;\n      uniform mat4 uProjectionMatrix;\n\n      varying highp vec2 vTextureCoord;\n\n      void main(void) {\n        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;\n        vTextureCoord = aTextureCoord;\n      }\n    ","\n      varying highp vec2 vTextureCoord;\n\n      uniform sampler2D uSampler;\n\n      void main(void) {\n        gl_FragColor = texture2D(uSampler, vTextureCoord);\n      }\n    "),r={program:t,attribLocations:{vertexPosition:e.getAttribLocation(t,"aVertexPosition"),textureCoord:e.getAttribLocation(t,"aTextureCoord")},uniformLocations:{projectionMatrix:e.getUniformLocation(t,"uProjectionMatrix"),modelViewMatrix:e.getUniformLocation(t,"uModelViewMatrix"),uSampler:e.getUniformLocation(t,"uSampler")}},i=this._initBuffers(e),n=this.utility.loadTexture(e,"images/cubetexture.png");this.scene={programInfo:r,buffers:i,texture:n,cubeRotation:0}}},{key:"drawScene",value:function(e,t){var r=this.scene,i=r.programInfo,n=r.buffers,a=r.texture;this.utility.clearScreen(e);var o=e.FLOAT;e.bindBuffer(e.ARRAY_BUFFER,n.position),e.vertexAttribPointer(i.attribLocations.vertexPosition,3,o,!1,0,0),e.enableVertexAttribArray(i.attribLocations.vertexPosition);var c=e.FLOAT;e.bindBuffer(e.ARRAY_BUFFER,n.textureCoord),e.vertexAttribPointer(i.attribLocations.textureCoord,2,c,!1,0,0),e.enableVertexAttribArray(i.attribLocations.textureCoord),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n.indices);var u=45*Math.PI/180,s=e.canvas.clientWidth/e.canvas.clientHeight,f=m.a();m.d(f,u,s,.1,100);var l=m.a();m.f(l,l,[-0,0,-6]),m.e(l,l,r.cubeRotation,[0,0,1]),m.e(l,l,.7*r.cubeRotation,[0,1,0]),e.useProgram(i.program),e.uniformMatrix4fv(i.uniformLocations.projectionMatrix,!1,f),e.uniformMatrix4fv(i.uniformLocations.modelViewMatrix,!1,l),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,a),e.uniform1i(i.uniformLocations.uSampler,0);var v=e.UNSIGNED_SHORT;e.drawElements(e.TRIANGLES,36,v,0),r.cubeRotation+=t}},{key:"_initBuffers",value:function(e){var t=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,t),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,1,-1,1,1,1,1,-1,1,1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1,-1,-1,1,-1,-1,1,1,1,1,1,1,1,-1,-1,-1,-1,1,-1,-1,1,-1,1,-1,-1,1,1,-1,-1,1,1,-1,1,1,1,1,-1,1,-1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1]),e.STATIC_DRAW);var r=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,r),e.bufferData(e.ARRAY_BUFFER,new Float32Array([0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1]),e.STATIC_DRAW);var i=e.createBuffer();return e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,i),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23]),e.STATIC_DRAW),{position:t,textureCoord:r,indices:i}}}]),e}(),b=function(){function e(){Object(c.a)(this,e),this.utility=new d,this.initScene=this.initScene.bind(this),this.drawScene=this.drawScene.bind(this)}return Object(u.a)(e,[{key:"initScene",value:function(e){var t=this._initShaders(e);this.scene={programInfo:{program:t,attribLocations:{vertexPosition:e.getAttribLocation(t,"aVertexPosition"),vertexNormal:e.getAttribLocation(t,"aVertexNormal"),textureCoord:e.getAttribLocation(t,"aTextureCoord")},uniformLocations:{projectionMatrix:e.getUniformLocation(t,"uProjectionMatrix"),modelViewMatrix:e.getUniformLocation(t,"uModelViewMatrix"),normalMatrix:e.getUniformLocation(t,"uNormalMatrix"),uSampler:e.getUniformLocation(t,"uSampler")}},buffers:this._initBuffers(e),texture:this.utility.loadTexture(e,"images/cubetexture.png"),cubeRotation:0,camera:[0,0,0],cameraDir:[0,0,8]}}},{key:"drawScene",value:function(e,t){var r=this.scene,i=r.programInfo,n=r.buffers,a=r.texture;this.utility.clearScreen(e);var o=e.FLOAT;e.bindBuffer(e.ARRAY_BUFFER,n.position),e.vertexAttribPointer(i.attribLocations.vertexPosition,3,o,!1,0,0),e.enableVertexAttribArray(i.attribLocations.vertexPosition);var c=e.FLOAT;e.bindBuffer(e.ARRAY_BUFFER,n.normal),e.vertexAttribPointer(i.attribLocations.vertexNormal,3,c,!1,0,0),e.enableVertexAttribArray(i.attribLocations.vertexNormal);var u=e.FLOAT;e.bindBuffer(e.ARRAY_BUFFER,n.textureCoord),e.vertexAttribPointer(i.attribLocations.textureCoord,2,u,!1,0,0),e.enableVertexAttribArray(i.attribLocations.textureCoord),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n.indices);var s=45*Math.PI/180,f=e.canvas.clientWidth/e.canvas.clientHeight,l=m.a();m.d(l,s,f,.1,100);var v=m.a();m.f(v,v,[-0,0,-6]),m.e(v,v,r.cubeRotation,[0,0,1]),m.e(v,v,.7*r.cubeRotation,[0,1,0]),m.e(v,v,.3*r.cubeRotation,[1,0,0]);var d=m.a();m.f(d,d,r.camera),m.b(d,d),m.c(d,d,v);var h=m.a();m.b(h,v),m.g(h,h),e.useProgram(i.program),e.uniformMatrix4fv(i.uniformLocations.projectionMatrix,!1,l),e.uniformMatrix4fv(i.uniformLocations.modelViewMatrix,!1,d),e.uniformMatrix4fv(i.uniformLocations.normalMatrix,!1,h),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,a),e.uniform1i(i.uniformLocations.uSampler,0);var A=e.UNSIGNED_SHORT;e.drawElements(e.TRIANGLES,36,A,0),r.cubeRotation+=t,r.camera[2]>64?(r.camera[2]=64,r.cameraDir[2]=-8):r.camera[2]<-2&&(r.camera[2]=-2,r.cameraDir[2]=8),r.camera[0]+=r.cameraDir[0]*t,r.camera[1]+=r.cameraDir[1]*t,r.camera[2]+=r.cameraDir[2]*t}},{key:"_initShaders",value:function(e){return this.utility.initShaderProgram(e,"\n      attribute vec4 aVertexPosition;\n      attribute vec3 aVertexNormal;\n      attribute vec2 aTextureCoord;\n\n      uniform mat4 uNormalMatrix;\n      uniform mat4 uModelViewMatrix;\n      uniform mat4 uProjectionMatrix;\n\n      varying highp vec2 vTextureCoord;\n      varying highp vec3 vLighting;\n\n      void main(void) {\n        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;\n        vTextureCoord = aTextureCoord;\n\n        // Apply lighting effect\n\n        highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);\n        highp vec3 directionalLightColor = vec3(1, 1, 1);\n        highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));\n\n        highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);\n\n        highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);\n        vLighting = ambientLight + (directionalLightColor * directional);\n      }\n    ","\n      varying highp vec2 vTextureCoord;\n      varying highp vec3 vLighting;\n\n      uniform sampler2D uSampler;\n\n      void main(void) {\n        highp vec4 texelColor = texture2D(uSampler, vTextureCoord);\n\n        gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);\n      }\n    ")}},{key:"_initBuffers",value:function(e){var t=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,t),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,1,-1,1,1,1,1,-1,1,1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1,-1,-1,1,-1,-1,1,1,1,1,1,1,1,-1,-1,-1,-1,1,-1,-1,1,-1,1,-1,-1,1,1,-1,-1,1,1,-1,1,1,1,1,-1,1,-1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1]),e.STATIC_DRAW);var r=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,r),e.bufferData(e.ARRAY_BUFFER,new Float32Array([0,0,1,0,0,1,0,0,1,0,0,1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,1,0,0,1,0,0,1,0,0,1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,1,0,0,1,0,0,1,0,0,1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0]),e.STATIC_DRAW);var i=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,i),e.bufferData(e.ARRAY_BUFFER,new Float32Array([0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1]),e.STATIC_DRAW);var n=e.createBuffer();return e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23]),e.STATIC_DRAW),{position:t,normal:r,textureCoord:i,indices:n}}}]),e}(),R=function(e){function t(e){var r;return Object(c.a)(this,t),(r=Object(s.a)(this,Object(f.a)(t).call(this,e))).onClickCanvas=r.onClickCanvas.bind(Object(l.a)(r)),r.renderCanvas=r.renderCanvas.bind(Object(l.a)(r)),r.scenes=[{init:!1,render:new h},{init:!1,render:new A},{init:!1,render:new x},{init:!1,render:new b}],r.sceneIndex=r.scenes.length-1,r}return Object(v.a)(t,e),Object(u.a)(t,[{key:"componentDidMount",value:function(){var e=this.canvas,t=e.getBoundingClientRect();if(e.width=t.width,e.height=t.height,this.gl=e.getContext("webgl"),null===this.gl)alert("Unable to initialize WebGL. Your browser or machine may not support it.");else{var r=this.scenes[this.sceneIndex];r.init||(r.init=!0,r.render.initScene(this.gl)),this.frame=window.requestAnimationFrame(this.renderCanvas)}}},{key:"componentWillUnmount",value:function(){window.cancelAnimationFrame(this.frame)}},{key:"onClickCanvas",value:function(e){e.preventDefault(),this.sceneIndex=(this.sceneIndex+1)%this.scenes.length;var t=this.scenes[this.sceneIndex];t.init||(t.init=!0,t.render.initScene(this.gl))}},{key:"renderCanvas",value:function(e){this.timeStamp||(this.timeStamp=e);var t=(e*=.001)-this.timeStamp;this.timeStamp=e,this.scenes[this.sceneIndex].render.drawScene(this.gl,t),this.frame=window.requestAnimationFrame(this.renderCanvas)}},{key:"render",value:function(){var e=this;return n.a.createElement("div",{className:"screen"},n.a.createElement("canvas",{className:"canvas",ref:function(t){return e.canvas=t},onClick:this.onClickCanvas}))}}]),t}(n.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(n.a.createElement(R,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[10,1,2]]]);
//# sourceMappingURL=main.ce1ac7ea.chunk.js.map