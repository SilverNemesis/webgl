(this.webpackJsonpwebgl=this.webpackJsonpwebgl||[]).push([[0],{10:function(e,t,r){e.exports=r(16)},15:function(e,t,r){},16:function(e,t,r){"use strict";r.r(t);var i=r(3),n=r.n(i),a=r(6),o=r.n(a),c=(r(15),r(1)),u=r(2),s=r(8),f=r(7),l=r(4),v=r(9),d=r(0);function h(e,t,r){var i=m(e,e.VERTEX_SHADER,t),n=m(e,e.FRAGMENT_SHADER,r),a=e.createProgram();return e.attachShader(a,i),e.attachShader(a,n),e.linkProgram(a),e.getProgramParameter(a,e.LINK_STATUS)?a:(alert("Unable to initialize the shader program: "+e.getProgramInfoLog(a)),null)}function m(e,t,r){var i=e.createShader(t);return e.shaderSource(i,r),e.compileShader(i),e.getShaderParameter(i,e.COMPILE_STATUS)?i:(alert("An error occurred compiling the shaders: "+e.getShaderInfoLog(i)),e.deleteShader(i),null)}function A(e,t){var r=e.createTexture();e.bindTexture(e.TEXTURE_2D,r);var i=e.RGBA,n=e.RGBA,a=e.UNSIGNED_BYTE,o=new Uint8Array([0,0,255,255]);e.texImage2D(e.TEXTURE_2D,0,i,1,1,0,n,a,o);var c=new Image;return c.onload=function(){e.bindTexture(e.TEXTURE_2D,r),e.texImage2D(e.TEXTURE_2D,0,i,n,a,c),x(c.width)&&x(c.height)?e.generateMipmap(e.TEXTURE_2D):(e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR))},c.src=t,r}function x(e){return 0===(e&e-1)}function b(e){e.clearColor(0,0,0,1),e.clearDepth(1),e.enable(e.DEPTH_TEST),e.depthFunc(e.LEQUAL),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT)}var R=[{x:-1,y:0},{x:0,y:-1},{x:1,y:0},{x:0,y:1}];function g(e,t){for(var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:.8,i=function(e){c[e.y][e.x]=0},n=function(e,t){if(!a(o(e,t,3)))return!1;var r=o(e,t,2);return 1===c[r.y][r.x]},a=function(r){return!(r.x<0||r.y<0||r.x>=e||r.y>=t)},o=function(e,t,r){return{x:e.x+t.x*r,y:e.y+t.y*r}},c=[],u=0;u<t;u++)c.push(new Array(e).fill(1));var s,f={x:1,y:1},l=[];for(i(f),l.push(f);l.length>0;){for(var v=l[l.length-1],d=[],h=0;h<R.length;h++){var m=R[h];n(v,m)&&d.push(m)}if(d.length>0){var A=void 0;A=d.includes(s)&&Math.random()>r?s:d[Math.floor(Math.random()*d.length)],i(o(v,A,1)),i(o(v,A,2)),l.push(o(v,A,2)),s=A}else l.pop(),s=null}return{width:e,height:t,data:c}}var E=function(){function e(){Object(c.a)(this,e),this.initScene=this.initScene.bind(this),this.drawScene=this.drawScene.bind(this)}return Object(u.a)(e,[{key:"initScene",value:function(e){var t=h(e,"\n    attribute vec4 aVertexPosition;\n    attribute vec4 aVertexColor;\n\n    uniform mat4 uModelViewMatrix;\n    uniform mat4 uProjectionMatrix;\n\n    varying lowp vec4 vColor;\n\n    void main(void) {\n      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;\n      vColor = aVertexColor;\n    }\n  ","\n    varying lowp vec4 vColor;\n\n    void main(void) {\n      gl_FragColor = vColor;\n    }\n  "),r={program:t,attribLocations:{vertexPosition:e.getAttribLocation(t,"aVertexPosition"),vertexColor:e.getAttribLocation(t,"aVertexColor")},uniformLocations:{projectionMatrix:e.getUniformLocation(t,"uProjectionMatrix"),modelViewMatrix:e.getUniformLocation(t,"uModelViewMatrix")}},i=this._initBuffers(e);this.scene={programInfo:r,buffers:i,squareRotation:0}}},{key:"drawScene",value:function(e,t){var r=this.scene,i=r.programInfo,n=r.buffers;b(e);var a=e.FLOAT;e.bindBuffer(e.ARRAY_BUFFER,n.color),e.vertexAttribPointer(i.attribLocations.vertexColor,4,a,!1,0,0),e.enableVertexAttribArray(i.attribLocations.vertexColor);var o=e.FLOAT;e.bindBuffer(e.ARRAY_BUFFER,n.position),e.vertexAttribPointer(i.attribLocations.vertexPosition,2,o,!1,0,0),e.enableVertexAttribArray(i.attribLocations.vertexPosition);var c=45*Math.PI/180,u=e.canvas.clientWidth/e.canvas.clientHeight,s=d.a();d.d(s,c,u,.1,100);var f=d.a();d.f(f,f,[-0,0,-6]),d.e(f,f,r.squareRotation,[0,0,1]),e.useProgram(i.program),e.uniformMatrix4fv(i.uniformLocations.projectionMatrix,!1,s),e.uniformMatrix4fv(i.uniformLocations.modelViewMatrix,!1,f);e.drawArrays(e.TRIANGLE_STRIP,0,4),r.squareRotation+=t}},{key:"_initBuffers",value:function(e){var t=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,t),e.bufferData(e.ARRAY_BUFFER,new Float32Array([1,1,-1,1,1,-1,-1,-1]),e.STATIC_DRAW);var r=e.createBuffer();return e.bindBuffer(e.ARRAY_BUFFER,r),e.bufferData(e.ARRAY_BUFFER,new Float32Array([1,1,1,1,1,0,0,1,0,1,0,1,0,0,1,1]),e.STATIC_DRAW),{position:t,color:r}}}]),e}(),_=function(){function e(){Object(c.a)(this,e),this.initScene=this.initScene.bind(this),this.drawScene=this.drawScene.bind(this)}return Object(u.a)(e,[{key:"initScene",value:function(e){var t=h(e,"\n    attribute vec4 aVertexPosition;\n    attribute vec4 aVertexColor;\n\n    uniform mat4 uModelViewMatrix;\n    uniform mat4 uProjectionMatrix;\n\n    varying lowp vec4 vColor;\n\n    void main(void) {\n      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;\n      vColor = aVertexColor;\n    }\n  ","\n    varying lowp vec4 vColor;\n\n    void main(void) {\n      gl_FragColor = vColor;\n    }\n  "),r={program:t,attribLocations:{vertexPosition:e.getAttribLocation(t,"aVertexPosition"),vertexColor:e.getAttribLocation(t,"aVertexColor")},uniformLocations:{projectionMatrix:e.getUniformLocation(t,"uProjectionMatrix"),modelViewMatrix:e.getUniformLocation(t,"uModelViewMatrix")}},i=this._initBuffers(e);this.scene={programInfo:r,buffers:i,cubeRotation:0}}},{key:"drawScene",value:function(e,t){var r=this.scene,i=r.programInfo,n=r.buffers;b(e);var a=e.FLOAT;e.bindBuffer(e.ARRAY_BUFFER,n.position),e.vertexAttribPointer(i.attribLocations.vertexPosition,3,a,!1,0,0),e.enableVertexAttribArray(i.attribLocations.vertexPosition);var o=e.FLOAT;e.bindBuffer(e.ARRAY_BUFFER,n.color),e.vertexAttribPointer(i.attribLocations.vertexColor,4,o,!1,0,0),e.enableVertexAttribArray(i.attribLocations.vertexColor),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n.indices);var c=45*Math.PI/180,u=e.canvas.clientWidth/e.canvas.clientHeight,s=d.a();d.d(s,c,u,.1,100);var f=d.a();d.f(f,f,[-0,0,-6]),d.e(f,f,r.cubeRotation,[0,0,1]),d.e(f,f,.7*r.cubeRotation,[0,1,0]),e.useProgram(i.program),e.uniformMatrix4fv(i.uniformLocations.projectionMatrix,!1,s),e.uniformMatrix4fv(i.uniformLocations.modelViewMatrix,!1,f);var l=e.UNSIGNED_SHORT;e.drawElements(e.TRIANGLES,36,l,0),r.cubeRotation+=t}},{key:"_initBuffers",value:function(e){var t=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,t),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,1,-1,1,1,1,1,-1,1,1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1,-1,-1,1,-1,-1,1,1,1,1,1,1,1,-1,-1,-1,-1,1,-1,-1,1,-1,1,-1,-1,1,1,-1,-1,1,1,-1,1,1,1,1,-1,1,-1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1]),e.STATIC_DRAW);for(var r=[[1,1,1,1],[1,0,0,1],[0,1,0,1],[0,0,1,1],[1,1,0,1],[1,0,1,1]],i=[],n=0;n<r.length;++n){var a=r[n];i=i.concat(a,a,a,a)}var o=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,o),e.bufferData(e.ARRAY_BUFFER,new Float32Array(i),e.STATIC_DRAW);var c=e.createBuffer();return e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,c),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23]),e.STATIC_DRAW),{position:t,color:o,indices:c}}}]),e}(),T=function(){function e(){Object(c.a)(this,e),this.initScene=this.initScene.bind(this),this.drawScene=this.drawScene.bind(this)}return Object(u.a)(e,[{key:"initScene",value:function(e){var t=h(e,"\n      attribute vec4 aVertexPosition;\n      attribute vec2 aTextureCoord;\n\n      uniform mat4 uModelViewMatrix;\n      uniform mat4 uProjectionMatrix;\n\n      varying highp vec2 vTextureCoord;\n\n      void main(void) {\n        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;\n        vTextureCoord = aTextureCoord;\n      }\n    ","\n      varying highp vec2 vTextureCoord;\n\n      uniform sampler2D uSampler;\n\n      void main(void) {\n        gl_FragColor = texture2D(uSampler, vTextureCoord);\n      }\n    "),r={program:t,attribLocations:{vertexPosition:e.getAttribLocation(t,"aVertexPosition"),textureCoord:e.getAttribLocation(t,"aTextureCoord")},uniformLocations:{projectionMatrix:e.getUniformLocation(t,"uProjectionMatrix"),modelViewMatrix:e.getUniformLocation(t,"uModelViewMatrix"),uSampler:e.getUniformLocation(t,"uSampler")}},i=this._initBuffers(e),n=A(e,"images/cubetexture.png");this.scene={programInfo:r,buffers:i,texture:n,cubeRotation:0}}},{key:"drawScene",value:function(e,t){var r=this.scene,i=r.programInfo,n=r.buffers,a=r.texture;b(e);var o=e.FLOAT;e.bindBuffer(e.ARRAY_BUFFER,n.position),e.vertexAttribPointer(i.attribLocations.vertexPosition,3,o,!1,0,0),e.enableVertexAttribArray(i.attribLocations.vertexPosition);var c=e.FLOAT;e.bindBuffer(e.ARRAY_BUFFER,n.textureCoord),e.vertexAttribPointer(i.attribLocations.textureCoord,2,c,!1,0,0),e.enableVertexAttribArray(i.attribLocations.textureCoord),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n.indices);var u=45*Math.PI/180,s=e.canvas.clientWidth/e.canvas.clientHeight,f=d.a();d.d(f,u,s,.1,100);var l=d.a();d.f(l,l,[-0,0,-6]),d.e(l,l,r.cubeRotation,[0,0,1]),d.e(l,l,.7*r.cubeRotation,[0,1,0]),e.useProgram(i.program),e.uniformMatrix4fv(i.uniformLocations.projectionMatrix,!1,f),e.uniformMatrix4fv(i.uniformLocations.modelViewMatrix,!1,l),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,a),e.uniform1i(i.uniformLocations.uSampler,0);var v=e.UNSIGNED_SHORT;e.drawElements(e.TRIANGLES,36,v,0),r.cubeRotation+=t}},{key:"_initBuffers",value:function(e){var t=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,t),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,1,-1,1,1,1,1,-1,1,1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1,-1,-1,1,-1,-1,1,1,1,1,1,1,1,-1,-1,-1,-1,1,-1,-1,1,-1,1,-1,-1,1,1,-1,-1,1,1,-1,1,1,1,1,-1,1,-1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1]),e.STATIC_DRAW);var r=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,r),e.bufferData(e.ARRAY_BUFFER,new Float32Array([0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1]),e.STATIC_DRAW);var i=e.createBuffer();return e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,i),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23]),e.STATIC_DRAW),{position:t,textureCoord:r,indices:i}}}]),e}(),F=function(){function e(t){Object(c.a)(this,e),this.gl=t,this.draw=this.draw.bind(this);var r=this._initShaders(t);this.model={program:r,attribLocations:{vertexPosition:t.getAttribLocation(r,"aVertexPosition"),vertexNormal:t.getAttribLocation(r,"aVertexNormal"),textureCoord:t.getAttribLocation(r,"aTextureCoord")},uniformLocations:{projectionMatrix:t.getUniformLocation(r,"uProjectionMatrix"),modelViewMatrix:t.getUniformLocation(r,"uModelViewMatrix"),normalMatrix:t.getUniformLocation(r,"uNormalMatrix"),uSampler:t.getUniformLocation(r,"uSampler")},buffers:this._initBuffers(t),texture:A(t,"images/cubetexture.png")}}return Object(u.a)(e,[{key:"draw",value:function(e,t,r){var i=this.gl,n=this.model,a=this.model,o=a.buffers,c=a.texture,u=i.FLOAT;i.bindBuffer(i.ARRAY_BUFFER,o.position),i.vertexAttribPointer(n.attribLocations.vertexPosition,3,u,!1,0,0),i.enableVertexAttribArray(n.attribLocations.vertexPosition);var s=i.FLOAT;i.bindBuffer(i.ARRAY_BUFFER,o.normal),i.vertexAttribPointer(n.attribLocations.vertexNormal,3,s,!1,0,0),i.enableVertexAttribArray(n.attribLocations.vertexNormal);var f=i.FLOAT;i.bindBuffer(i.ARRAY_BUFFER,o.textureCoord),i.vertexAttribPointer(n.attribLocations.textureCoord,2,f,!1,0,0),i.enableVertexAttribArray(n.attribLocations.textureCoord),i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,o.indices);var l=d.a();d.b(l,r),d.g(l,l);var v=d.a();d.c(v,t,r),i.useProgram(n.program),i.uniformMatrix4fv(n.uniformLocations.projectionMatrix,!1,e),i.uniformMatrix4fv(n.uniformLocations.modelViewMatrix,!1,v),i.uniformMatrix4fv(n.uniformLocations.normalMatrix,!1,l),i.activeTexture(i.TEXTURE0),i.bindTexture(i.TEXTURE_2D,c),i.uniform1i(n.uniformLocations.uSampler,0);var h=i.UNSIGNED_SHORT;i.drawElements(i.TRIANGLES,36,h,0)}},{key:"_initShaders",value:function(e){return h(e,"\n      attribute vec4 aVertexPosition;\n      attribute vec3 aVertexNormal;\n      attribute vec2 aTextureCoord;\n\n      uniform mat4 uNormalMatrix;\n      uniform mat4 uModelViewMatrix;\n      uniform mat4 uProjectionMatrix;\n\n      varying highp vec2 vTextureCoord;\n      varying highp vec3 vLighting;\n\n      void main(void) {\n        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;\n        vTextureCoord = aTextureCoord;\n\n        // Apply lighting effect\n\n        highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);\n        highp vec3 directionalLightColor = vec3(1, 1, 1);\n        highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));\n\n        highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);\n\n        highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);\n        vLighting = ambientLight + (directionalLightColor * directional);\n      }\n    ","\n      varying highp vec2 vTextureCoord;\n      varying highp vec3 vLighting;\n\n      uniform sampler2D uSampler;\n\n      void main(void) {\n        highp vec4 texelColor = texture2D(uSampler, vTextureCoord);\n\n        gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);\n      }\n    ")}},{key:"_initBuffers",value:function(e){var t=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,t),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,1,-1,1,1,1,1,-1,1,1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1,-1,-1,1,-1,-1,1,1,1,1,1,1,1,-1,-1,-1,-1,1,-1,-1,1,-1,1,-1,-1,1,1,-1,-1,1,1,-1,1,1,1,1,-1,1,-1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1]),e.STATIC_DRAW);var r=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,r),e.bufferData(e.ARRAY_BUFFER,new Float32Array([0,0,1,0,0,1,0,0,1,0,0,1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,1,0,0,1,0,0,1,0,0,1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,1,0,0,1,0,0,1,0,0,1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0]),e.STATIC_DRAW);var i=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,i),e.bufferData(e.ARRAY_BUFFER,new Float32Array([0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1]),e.STATIC_DRAW);var n=e.createBuffer();return e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23]),e.STATIC_DRAW),{position:t,normal:r,textureCoord:i,indices:n}}}]),e}(),L=function(){function e(){Object(c.a)(this,e),this.initScene=this.initScene.bind(this),this.drawScene=this.drawScene.bind(this)}return Object(u.a)(e,[{key:"initScene",value:function(e){var t=new F(e);this.scene={actors:[{model:t,location:[-2,0,-5.5],rotation:0,rotationSpeed:1},{model:t,location:[2,0,-5.5],rotation:0,rotationSpeed:2}],camera:[0,0,0],cameraDir:[0,0,8]}}},{key:"drawScene",value:function(e,t){var r=this.scene;b(e);var i=45*Math.PI/180,n=e.canvas.clientWidth/e.canvas.clientHeight,a=d.a();d.d(a,i,n,.1,100);var o=d.a();d.f(o,o,r.camera),d.b(o,o);for(var c=0;c<r.actors.length;c++){var u=r.actors[c];this._renderActor(a,o,u),this._animateActor(t,u)}r.camera[2]>64?(r.camera[2]=64,r.cameraDir[2]=-8):r.camera[2]<0&&(r.camera[2]=0,r.cameraDir[2]=8),r.camera[0]+=r.cameraDir[0]*t,r.camera[1]+=r.cameraDir[1]*t,r.camera[2]+=r.cameraDir[2]*t}},{key:"_renderActor",value:function(e,t,r){var i=r.model,n=d.a();d.f(n,n,r.location),d.e(n,n,r.rotation,[0,0,1]),d.e(n,n,.7*r.rotation,[0,1,0]),d.e(n,n,.3*r.rotation,[1,0,0]),i.draw(e,t,n)}},{key:"_animateActor",value:function(e,t){t.rotation+=e*t.rotationSpeed}}]),e}(),p=function(){function e(t,r){Object(c.a)(this,e),this.gl=t,this.maze=r,this.draw=this.draw.bind(this);var i=this._initShaders(t);this.model={program:i,attribLocations:{vertexPosition:t.getAttribLocation(i,"aVertexPosition"),vertexColor:t.getAttribLocation(i,"aVertexColor")},uniformLocations:{projectionMatrix:t.getUniformLocation(i,"uProjectionMatrix"),modelViewMatrix:t.getUniformLocation(i,"uModelViewMatrix")},buffers:this._initBuffers(t,r)}}return Object(u.a)(e,[{key:"update",value:function(e){this._freeBuffers(this.gl,this.model.buffers),this.maze=e,this.model.buffers=this._initBuffers(this.gl,e)}},{key:"draw",value:function(e,t,r){var i=this.gl,n=this.model,a=this.model.buffers,o=i.FLOAT;i.bindBuffer(i.ARRAY_BUFFER,a.position),i.vertexAttribPointer(n.attribLocations.vertexPosition,3,o,!1,0,0),i.enableVertexAttribArray(n.attribLocations.vertexPosition);var c=i.FLOAT;i.bindBuffer(i.ARRAY_BUFFER,a.color),i.vertexAttribPointer(n.attribLocations.vertexColor,4,c,!1,0,0),i.enableVertexAttribArray(n.attribLocations.vertexColor),i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,a.indices);var u=d.a();d.c(u,t,r),i.useProgram(n.program),i.uniformMatrix4fv(n.uniformLocations.projectionMatrix,!1,e),i.uniformMatrix4fv(n.uniformLocations.modelViewMatrix,!1,u);var s=a.vertexCount,f=i.UNSIGNED_INT;i.drawElements(i.TRIANGLES,s,f,0)}},{key:"_initShaders",value:function(e){return h(e,"\n      attribute vec4 aVertexPosition;\n      attribute vec4 aVertexColor;\n\n      uniform mat4 uModelViewMatrix;\n      uniform mat4 uProjectionMatrix;\n\n      varying lowp vec4 vColor;\n\n      void main(void) {\n        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;\n        vColor = aVertexColor;\n      }\n    ","\n      varying lowp vec4 vColor;\n\n      void main(void) {\n        gl_FragColor = vColor;\n      }\n    ")}},{key:"_initBuffers",value:function(e,t){for(var r=[],i=[],n=[],a=0,o=function(e,t,o,c,u,s){r.push(e,o,u,t,o,u,t,c,u,e,c,u),n.push(a+0,a+1,a+2,a+0,a+2,a+3),a+=4;for(var f=0;f<4;f++)for(var l=0;l<4;l++)i.push(s[l])},c=function(e,t,o,c,u,s){r.push(e,u,o,t,u,o,t,u,c,e,u,c),n.push(a+0,a+1,a+2,a+0,a+2,a+3),a+=4;for(var f=0;f<4;f++)for(var l=0;l<4;l++)i.push(s[l])},u=function(e,t,o,c,u,s){r.push(u,e,o,u,t,o,u,t,c,u,e,c),n.push(a+0,a+1,a+2,a+0,a+2,a+3),a+=4;for(var f=0;f<4;f++)for(var l=0;l<4;l++)i.push(s[l])},s=[.2,.2,.2,1],f=[.7,.7,.7,1],l=[.5,0,.5,1],v=[0,.5,0,1],d=[.5,0,0,1],h=[0,0,.5,1],m=-t.width/2,A=-t.height/2,x=0;x<t.height;x++)for(var b=0;b<t.width;b++){var R=b+m,g=R+1,E=x+A,_=E+1;0===t.data[x][b]?o(R,g,E,_,0,s):(o(R,g,E,_,1,f),0!==x&&0!==t.data[x-1][b]||c(R,g,0,1,E,l),0!==b&&0!==t.data[x][b-1]||u(E,_,0,1,R,d),x!==t.height-1&&0!==t.data[x+1][b]||c(R,g,0,1,_,v),b!==t.width-1&&0!==t.data[x][b+1]||u(E,_,0,1,g,h))}var T=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,T),e.bufferData(e.ARRAY_BUFFER,new Float32Array(r),e.STATIC_DRAW);var F=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,F),e.bufferData(e.ARRAY_BUFFER,new Float32Array(i),e.STATIC_DRAW);var L=e.createBuffer();return e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,L),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint32Array(n),e.STATIC_DRAW),{position:T,color:F,indices:L,vertexCount:n.length}}},{key:"_freeBuffers",value:function(e,t){e.deleteBuffer(t.position),e.deleteBuffer(t.color),e.deleteBuffer(t.indices)}}]),e}(),B=function(){function e(){Object(c.a)(this,e),this.initScene=this.initScene.bind(this),this.drawScene=this.drawScene.bind(this),this.totalDelta=0}return Object(u.a)(e,[{key:"initScene",value:function(e){var t=2*Math.floor(45*Math.random())+11,r=g(t,t),i=new p(e,r);this.scene={actors:[{model:i,location:[0,0,-2*t],rotation:{angle:0,axis:[0,0,1],speed:.5}}],camera:[0,0,0],cameraDir:[0,0,8]}}},{key:"drawScene",value:function(e,t){var r=this.scene;b(e);var i=45*Math.PI/180,n=e.canvas.clientWidth/e.canvas.clientHeight,a=d.a();d.d(a,i,n,.1,500);var o=d.a();d.f(o,o,r.camera),d.b(o,o);for(var c=0;c<r.actors.length;c++){var u=r.actors[c];this._renderActor(a,o,u),this._animateActor(t,u)}}},{key:"_renderActor",value:function(e,t,r){var i=r.model,n=d.a();d.f(n,n,r.location),d.e(n,n,-45*(Math.PI/180),[1,0,0]),d.e(n,n,r.rotation.angle,r.rotation.axis),i.draw(e,t,n)}},{key:"_animateActor",value:function(e,t){if(t.rotation.angle+=e*t.rotation.speed,this.totalDelta+=e,this.totalDelta>=10){this.totalDelta-=10;var r=2*Math.floor(45*Math.random())+11,i=g(r,r);t.location[2]=-2*r,t.model.update(i)}}}]),e}(),M=function(e){function t(e){var r;return Object(c.a)(this,t),(r=Object(s.a)(this,Object(f.a)(t).call(this,e))).onClickCanvas=r.onClickCanvas.bind(Object(l.a)(r)),r.renderCanvas=r.renderCanvas.bind(Object(l.a)(r)),r.scenes=[{init:!1,render:new E},{init:!1,render:new _},{init:!1,render:new T},{init:!1,render:new L},{init:!1,render:new B}],r.sceneIndex=r.scenes.length-1,r}return Object(v.a)(t,e),Object(u.a)(t,[{key:"componentDidMount",value:function(){var e=this.canvas,t=e.getBoundingClientRect();if(e.width=t.width,e.height=t.height,this.gl=e.getContext("webgl"),null===this.gl)alert("Unable to initialize WebGL. Your browser or machine may not support it.");else{this.gl.getExtension("OES_element_index_uint");var r=this.scenes[this.sceneIndex];r.init||(r.init=!0,r.render.initScene(this.gl)),this.frame=window.requestAnimationFrame(this.renderCanvas)}}},{key:"componentWillUnmount",value:function(){window.cancelAnimationFrame(this.frame)}},{key:"onClickCanvas",value:function(e){e.preventDefault(),this.sceneIndex=(this.sceneIndex+1)%this.scenes.length;var t=this.scenes[this.sceneIndex];t.init||(t.init=!0,t.render.initScene(this.gl))}},{key:"renderCanvas",value:function(e){e*=.001,this.timeStamp||(this.timeStamp=e);var t=e-this.timeStamp;this.timeStamp=e,this.scenes[this.sceneIndex].render.drawScene(this.gl,t),this.frame=window.requestAnimationFrame(this.renderCanvas)}},{key:"render",value:function(){var e=this;return n.a.createElement("div",{className:"screen"},n.a.createElement("canvas",{className:"canvas",ref:function(t){return e.canvas=t},onClick:this.onClickCanvas}))}}]),t}(n.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(n.a.createElement(M,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[10,1,2]]]);
//# sourceMappingURL=main.60da1835.chunk.js.map