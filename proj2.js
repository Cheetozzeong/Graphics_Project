import * as mat4 from "../lib/gl-matrix/mat4.js"
import {toRadian} from "../lib/gl-matrix/common.js"

"use strict";


function main() {

    const loc_aPosition = 3;
    const loc_aColor = 8;
    const src_vert = `#version 300 es
    layout(location=${loc_aPosition}) in vec4 aPosition;
    layout(location=${loc_aColor}) in vec4 aColor;
    uniform mat4 uMVP;
    out vec4 vColor;
    void main()
    {
        gl_Position = uMVP * aPosition;
        vColor = aColor;
    }`;
    const src_frag = `#version 300 es
    precision mediump float;
    in vec4 vColor;
    out vec4 fColor;
    void main()
    {
        fColor = vColor;
    }`;

    
    const canvas = document.getElementById('webgl');
    const gl = canvas.getContext("webgl2");
    let v_shader = gl.createShader(gl.VERTEX_SHADER);
    let f_shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(v_shader, src_vert);
    gl.shaderSource(f_shader, src_frag);
    gl.compileShader(v_shader);
    gl.compileShader(f_shader);
    let pro = gl.createProgram();
    gl.attachShader(pro, v_shader);
    gl.attachShader(pro, f_shader);
    gl.linkProgram(pro);
    gl.useProgram(pro);

    const vao = initVertexBuffers({gl, loc_aPosition, loc_aColor});
    const vao_Axes = initAxes({gl, loc_aPosition, loc_aColor});
    const vao_xz = initCirlce_xz({gl, loc_aPosition, loc_aColor});
    const vao_zy = initCirlce_zy({gl, loc_aPosition, loc_aColor});

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0,0,0,1);

    var loc_MVP = gl.getUniformLocation(pro, 'uMVP');
    const w = canvas.width;
    const h = canvas.height;
    var P = mat4.create();
    var V = mat4.create();
    var MVP = mat4.create();
    
    document.getElementById("longitude").oninput = function(ev) {rebulid(gl, vao, vao_Axes, MVP, loc_MVP);};
    document.getElementById("latitude").oninput = function(ev) {rebulid(gl, vao, vao_Axes, MVP, loc_MVP);};

    function rebulid(gl, vao, vao_Axes, MVP, loc_MVP)
{
    
    let long_angle = parseInt(document.getElementById("longitude").value);
    let lati_angle = parseInt(document.getElementById("latitude").value);

    mat4.perspective(P, toRadian(30), 1, 1, 100);
    gl.viewport(0, 0, w/2, h);
    mat4.lookAt(V, [-30, 30, -30], [0, 0, 0], [0, 1, 0]);
    mat4.multiply(MVP, P, V);
    mat4.translate(MVP, MVP, [0, 0, -1]);
    mat4.rotate(MVP, MVP, toRadian(long_angle), [0, 1, 0]);
    mat4.rotate(MVP, MVP, toRadian(lati_angle), [1, 0, 0]);

    gl.uniformMatrix4fv(loc_MVP, false, MVP);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindVertexArray(vao); 
    gl.drawArrays(gl.TRIANGLES, 0, 36);
    gl.drawArrays(gl.LINES, 0, 8);
    gl.bindVertexArray(null); 

    gl.bindVertexArray(vao_Axes); 
    gl.drawArrays(gl.LINES, 0, 6);
    gl.bindVertexArray(null); 

    gl.bindVertexArray(vao_xz); 
    gl.drawArrays(gl.LINES, 0, 48);
    gl.bindVertexArray(null);

    gl.bindVertexArray(vao_zy); 
    gl.drawArrays(gl.LINES, 0, 48);
    gl.bindVertexArray(null); 

    gl.viewport(w/2, 0, w/2, h);
    mat4.perspective(P, toRadian(30), 1, 1, 100);
    mat4.lookAt(V, [0, 0, 10], [0, 0, -1], [0, 1, 0]);
    mat4.multiply(MVP, P, V);
    mat4.rotate(MVP, MVP, toRadian(long_angle), [0, 1, 0]);
    mat4.rotate(MVP, MVP, toRadian(lati_angle), [1, 0, 0]);
    gl.uniformMatrix4fv(loc_MVP, false, MVP);


    gl.bindVertexArray(vao); 
    gl.drawArrays(gl.TRIANGLES, 0, 36);
    gl.drawArrays(gl.LINES, 0, 8);
    gl.bindVertexArray(null); 

    gl.bindVertexArray(vao_Axes); 
    gl.drawArrays(gl.LINES, 0, 6);
    gl.bindVertexArray(null); 
    
}
    document.getElementById("long").innerText= document.getElementById("longitude").value;
    document.getElementById("lati").innerText= document.getElementById("latitude").value;

    const changelong = document.getElementById('longitude');
    const changelati = document.getElementById('latitude');

    changelong.addEventListener('change', (event) => {
    
        const result_long = document.getElementById('long');
        result_long.innerText = document.getElementById("longitude").value;
        rebulid(gl, vao, vao_Axes, MVP, loc_MVP);
      });

    changelati.addEventListener('change', (event) => {
        const result_lati = document.getElementById('lati');
        result_lati.innerText = document.getElementById("latitude").value;
        rebulid(gl, vao, vao_Axes, MVP, loc_MVP);
      });

      
    document.addEventListener('keydown', (event) => {

    const keyName_d = event.key;
    const long_key = document.getElementById('long');
    long_key.innerText = document.getElementById("longitude").value;
    const lati_key = document.getElementById('lati');
    lati_key.innerText = document.getElementById("latitude").value;


    if (keyName_d === 'ArrowRight') {
        document.getElementById("longitude").value++;
        document.getElementById("text").innerText="rightarrow is pressed"
        rebulid(gl, vao, vao_Axes, MVP, loc_MVP);
    }
        else if (keyName_d === 'ArrowLeft') {
            document.getElementById("longitude").value--;
            document.getElementById("text").innerText="leftarrow is pressed"
            rebulid(gl, vao, vao_Axes, MVP, loc_MVP);
        }
        else if (keyName_d === 'ArrowUp') {
            document.getElementById("latitude").value++;
            document.getElementById("text").innerText="uparrow is pressed"
            rebulid(gl, vao, vao_Axes, MVP, loc_MVP);
        }
        else if (keyName_d === 'ArrowDown') {
            document.getElementById("latitude").value--;
            document.getElementById("text").innerText="downarrow is pressed"
            rebulid(gl, vao, vao_Axes, MVP, loc_MVP);
    }
    }, false);

    document.addEventListener('keyup', (event) => {
            document.getElementById("text").innerText=" ";
            

    }, false);

    rebulid(gl, vao, vao_Axes, MVP, loc_MVP);
}

function initVertexBuffers({gl, loc_aPosition, loc_aColor})
{
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao); 

    const verticesColors = new Float32Array([

         1.0,  1.0,  1.0,     0.0,  1.0,  1.0,  // v0 
         1.0, -1.0,  1.0,     0.0,  1.0,  1.0,  // v3 
         1.0, -1.0, -1.0,     0.0,  1.0,  1.0,  // v4 

         1.0,  1.0,  1.0,     0.0,  1.0,  1.0,  // v0 
         1.0, -1.0, -1.0,     0.0,  1.0,  1.0,  // v4 
         1.0,  1.0, -1.0,     0.0,  1.0,  1.0,  // v5 
        
         1.0,  1.0,  1.0,     0.0,  1.0,  0.0,  // v0 
         1.0,  1.0, -1.0,     0.0,  1.0,  0.0,  // v5
        -1.0,  1.0, -1.0,     0.0,  1.0,  0.0,  // v6 

         1.0,  1.0,  1.0,     0.0,  1.0,  0.0,  // v0 
        -1.0,  1.0, -1.0,     0.0,  1.0,  0.0,  // v6 
        -1.0,  1.0,  1.0,     0.0,  1.0,  0.0,  // v1 

         1.0,  1.0,  1.0,     1.0,  0.0,  1.0,  // v0 
        -1.0,  1.0,  1.0,     1.0,  0.0,  1.0,  // v1 
        -1.0, -1.0,  1.0,     1.0,  0.0,  1.0,  // v2 

         1.0,  1.0,  1.0,     1.0,  0.0,  1.0,  // v0 
        -1.0, -1.0,  1.0,     1.0,  0.0,  1.0,  // v2 
         1.0, -1.0,  1.0,     1.0,  0.0,  1.0,  // v3 

        -1.0, -1.0, -1.0,     1.0,  0.0,  0.0,  // v7 
        -1.0, -1.0,  1.0,     1.0,  0.0,  0.0,  // v2 
        -1.0,  1.0,  1.0,     1.0,  0.0,  0.0,  // v1 

        -1.0, -1.0, -1.0,     1.0,  0.0,  0.0,  // v7 
        -1.0,  1.0,  1.0,     1.0,  0.0,  0.0,  // v1 
        -1.0,  1.0, -1.0,     1.0,  0.0,  0.0,  // v6 

        -1.0, -1.0, -1.0,     0.5,  0.5,  0.5,  // v7 
        -1.0,  1.0, -1.0,     0.5,  0.5,  0.5,  // v6 
         1.0,  1.0, -1.0,     0.5,  0.5,  0.5,  // v5 

        -1.0, -1.0, -1.0,     0.5,  0.5,  0.5,  // v7 
         1.0,  1.0, -1.0,     0.5,  0.5,  0.5,  // v5 
         1.0, -1.0, -1.0,     0.5,  0.5,  0.5,  // v4 

        -1.0, -1.0, -1.0,     0.0,  0.0,  1.0,  // v7 
         1.0, -1.0, -1.0,     0.0,  0.0,  1.0,  // v4 
         1.0, -1.0,  1.0,     0.0,  0.0,  1.0,  // v3 

        -1.0, -1.0, -1.0,     0.0,  0.0,  1.0,  // v7 
         1.0, -1.0,  1.0,     0.0,  0.0,  1.0,  // v3 
        -1.0, -1.0,  1.0,     0.0,  0.0,  1.0,  // v2 
    ]);
    
   
    const vbo = gl.createBuffer();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
    
    const FSIZE = verticesColors.BYTES_PER_ELEMENT;

    gl.vertexAttribPointer(loc_aPosition, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(loc_aPosition);

    gl.vertexAttribPointer(loc_aColor, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(loc_aColor);

    gl.bindVertexArray(null); 
    gl.disableVertexAttribArray(loc_aPosition);
    gl.disableVertexAttribArray(loc_aColor);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    return vao;
}

function initAxes({gl, loc_aPosition, loc_aColor})
{
    const vao_Axes = gl.createVertexArray();
    gl.bindVertexArray(vao_Axes); 

    const color_Axes = new Float32Array([

        0, 0, 0, 1, 0, 0,
        10, 0, 0, 1, 0, 0,
        0, 0, 0, 0, 1, 0,
        0, 10, 0, 0, 1, 0,
        0, 0, 0, 0, 0, 1,
        0, 0, 10, 0, 0, 1
    ]); 
    
   
    const vbo = gl.createBuffer();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, color_Axes, gl.STATIC_DRAW);
    
    const FSIZE = color_Axes.BYTES_PER_ELEMENT;

    gl.vertexAttribPointer(loc_aPosition, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(loc_aPosition);

    gl.vertexAttribPointer(loc_aColor, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(loc_aColor);

    gl.bindVertexArray(null); 
    gl.disableVertexAttribArray(loc_aPosition);
    gl.disableVertexAttribArray(loc_aColor);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    return vao_Axes;
}

function initCirlce_xz({gl, loc_aPosition, loc_aColor})
{
    const vao_xz = gl.createVertexArray();
    gl.bindVertexArray(vao_xz); 

    const color_xz = new Float32Array([

        0, 0, 10,  1, 1, 1,
        5, 0, 8.7, 1, 1, 1,
        5, 0, 8.7, 1, 1, 1,
        6.1, 0, 7.9, 1,1,1,
        6.1, 0, 7.9, 1,1,1,
        7.1, 0, 7.1, 1, 1, 1,
        7.1, 0, 7.1, 1, 1, 1,
        7.9, 0, 6.1, 1, 1, 1,
        7.9, 0, 6.1, 1, 1, 1,
        8.7, 0, 5, 1, 1, 1,
        8.7, 0, 5, 1, 1, 1,
        10, 0, 0, 1, 1, 1, //1사분면

        10, 0, 0, 1, 1, 1,
        8.7, 0, -5, 1, 1, 1,
        8.7, 0, -5, 1, 1, 1,
        7.9, 0, -6.1, 1, 1, 1,
        7.9, 0, -6.1, 1, 1, 1,
        7.1, 0, -7.1, 1, 1, 1,
        7.1, 0, -7.1, 1, 1, 1,
        6.1, 0, -7.9, 1,1,1,
        6.1, 0, -7.9, 1,1,1,
        5, 0, -8.7, 1, 1, 1,
        5, 0, -8.7, 1, 1, 1,
        0, 0 ,-10, 1, 1, 1, // 2사분면

        0, 0, -10, 1, 1, 1,
        -5.0, 0, -8.7, 1, 1, 1,
        -5.0, 0, -8.7, 1, 1, 1,
        -6.1, 0, -7.9, 1,1,1,
        -6.1, 0, -7.9, 1,1,1,
        -7.1, 0, -7.1, 1, 1, 1,
        -7.1, 0, -7.1, 1, 1, 1,
        -7.9, 0, -6.1, 1, 1, 1,
        -7.9, 0, -6.1, 1, 1, 1,
        -8.7, 0, -5.0, 1, 1, 1,
        -8.7, 0, -5.0, 1, 1, 1,
        -10, 0, 0, 1,1,1, // 3사분면

        -10, 0, 0,  1,1,1,
        -8.7, 0, 5.0, 1,1,1,
        -8.7, 0, 5.0, 1,1,1,
        -7.9, 0, 6.1, 1, 1, 1,
        -7.9, 0, 6.1, 1, 1, 1,
        -7.1, 0, 7.1, 1,1,1,
        -7.1, 0, 7.1, 1,1,1,
        -6.1, 0, 7.9, 1,1,1,
        -6.1, 0, 7.9, 1,1,1,
        -5.0, 0, 8.7, 1,1,1,
        -5.0, 0, 8.7, 1,1,1,
        0,0,10,1,1,1 //4사분면
        


    ]);
    
   
    const vbo = gl.createBuffer();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, color_xz, gl.STATIC_DRAW);
    
    const FSIZE = color_xz.BYTES_PER_ELEMENT;

    gl.vertexAttribPointer(loc_aPosition, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(loc_aPosition);

    gl.vertexAttribPointer(loc_aColor, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(loc_aColor);

    gl.bindVertexArray(null); 
    gl.disableVertexAttribArray(loc_aPosition);
    gl.disableVertexAttribArray(loc_aColor);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    return vao_xz;
}

function initCirlce_zy({gl, loc_aPosition, loc_aColor})
{
    const vao_zy = gl.createVertexArray();
    gl.bindVertexArray(vao_zy); 

    const color_zy = new Float32Array([

        0, 0, 10,  1, 1, 0,
        0, 5, 8.7, 1, 1, 0,
        0, 5, 8.7, 1, 1, 0,
        0, 6.1, 7.9, 1, 1, 0,
        0, 6.1, 7.9, 1, 1, 0,
        0, 7.1, 7.1, 1, 1, 0,
        0, 7.1, 7.1, 1, 1, 0,
        0, 7.9, 6.1, 1, 1, 0,
        0, 7.9, 6.1, 1, 1, 0,
        0, 8.7, 5, 1, 1, 0,
        0, 8.7, 5, 1, 1, 0,
        0, 10, 0, 1, 1, 0, //1사분면

        0, 10, 0, 1, 1, 0,
        0, 8.7, -5, 1, 1, 0,
        0, 8.7, -5, 1, 1, 0,
        0, 7.9, -6.1, 1, 1, 0,
        0, 7.9, -6.1, 1, 1, 0,
        0, 7.1, -7.1, 1, 1, 0,
        0, 7.1, -7.1, 1, 1, 0,
        0, 6.1, -7.9, 1,1,0,
        0, 6.1, -7.9, 1,1,0,
        0, 5, -8.7, 1, 1, 0,
        0, 5, -8.7, 1, 1, 0,
        0, 0 ,-10, 1, 1, 1, // 2사분면

        0, 0, -10, 1, 1, 0,
        0, -5.0, -8.7, 1, 1, 0,
        0, -5.0, -8.7, 1, 1, 0,
        0, -6.1, -7.9, 1,1,0,
        0, -6.1, -7.9, 1,1,0,
        0, -7.1, -7.1, 1, 1, 0,
        0, -7.1, -7.1, 1, 1, 0,
        0, -7.9, -6.1, 1, 1, 0,
        0, -7.9, -6.1, 1, 1, 0,
        0, -8.7, -5.0, 1, 1, 0,
        0, -8.7, -5.0, 1, 1, 0,
        0, -10, 0, 1,1,1, // 3사분면

        0, -10, 0,  1,1,0,
        0, -8.7, 5.0, 1,1,0,
        0, -8.7, 5.0, 1,1,0,
        0, -7.9, 6.1, 1, 1, 0,
        0, -7.9, 6.1, 1, 1, 0,
        0, -7.1, 7.1, 1,1,0,
        0, -7.1, 7.1, 1,1,0,
        0, -6.1, 7.9, 1,1,0,
        0, -6.1, 7.9, 1,1,0,
        0, -5.0, 8.7, 1,1,0,
        0, -5.0, 8.7, 1,1,0,
        0,0,10,1,1,0 //4사분면*/
        


    ]);
    
   
    const vbo = gl.createBuffer();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, color_zy, gl.STATIC_DRAW);
    
    const FSIZE = color_zy.BYTES_PER_ELEMENT;

    gl.vertexAttribPointer(loc_aPosition, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(loc_aPosition);

    gl.vertexAttribPointer(loc_aColor, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(loc_aColor);

    gl.bindVertexArray(null); 
    gl.disableVertexAttribArray(loc_aPosition);
    gl.disableVertexAttribArray(loc_aColor);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    return vao_zy;
}



main();

    