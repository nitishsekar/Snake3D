/* GLOBAL CONSTANTS AND VARIABLES */

/* assignment specific globals */
const WIN_Z = 0;  // default graphics window z coord in world space
const WIN_LEFT = 0; const WIN_RIGHT = 1;  // default left and right x coords in world space
const WIN_BOTTOM = 0; const WIN_TOP = 1;  // default top and bottom y coords in world space

const INPUT_TRIANGLES_URL = "https://ncsucgclass.github.io/prog4/triangles.json"; // triangles file loc
const INPUT_ELLIPSOIDS_URL = "https://pages.github.ncsu.edu/cgclass/exercise5/ellipsoids.json"; // ellipsoids file loc
const LIGHTS_URL = "https://ncsucgclass.github.io/prog4/lights.json";
var Eye = new vec4.fromValues(0.5,0.5,-0.5,1.0); // default eye position in world space

/* webgl globals */
var gl = null; // the all powerful gl object. It's all here folks!
var vertexBuffer = []; // this contains vertex coordinates in triples
var triangleBuffer = []; // this contains indices into vertexBuffer in triples
var normalBuffer = [];
var uvBuffer = [];

// Buffer sizes
var normalBufferSize = 0;
var uvBufferSize = 0;
var triBufferSize = []; // the number of indices in the triangle buffer

// Color variables
var color = [];
var ambColor = [];
var specColor = [];
var specN;
var triTex = [];
var textures = [];
var texFlag = 0;
var alpha;
var alphaflag = true;

// Triangle variables
var normal = [];
var inputTriangles;
var inputTrianglesCopy;
var toCenter = [];
var toCenterCopy = [];

// Light and eye variables
var inputLight;
var Ka, Kd, Ks;
var lightLoc = [];
var eyeLoc = [];
var lookAtV = [];
var lookUp = [];
var focusLen;
var newLook = [];

// Perspective
var pTransform;
var vTransform;

// Snake variables
var snakeNodes = [];
var sindex = 14;
var NPsindex = 15;
var sindexTemp = 14;
var NPsindexTemp = 15;
var sHead = 14;
var grid = [];
var snakeLen = 1;
var NPsnakeLen = 1;
var score = 0;
var food = 13;
var foodLoc;
var lastNodeP;
var NPlastNodeP;
var snakeTex;
var snakeCtr;
var hi = 1, hj = 1;
var ni = 8, nj = 8;
var hli = 1, hlj = 1;
var nli = 8, nlj = 8;
var gameCtr = 0;
var speed = 1;

// Flags and counters for key-mapped actions
var lightingFlag = 0.0;
var selectCtr = -1;
var selectFlag = 0;
var xAngle = 0, yAngle = 0;
var keyFlag = 0;


// GLSL related variables
var shaderProgram;
var GLSLLocs;

// Animation request
let animReq;

function resetAll(){
	vertexBuffer = []; // this contains vertex coordinates in triples
	triangleBuffer = []; // this contains indices into vertexBuffer in triples
	normalBuffer = [];
	uvBuffer = [];
	normalBufferSize = 0;
	uvBufferSize = 0;
	triBufferSize = []; // the number of indices in the triangle buffer
	color = [];
	ambColor = [];
	specColor = [];
	triTex = [];
	textures = [];
	texFlag = 0;
	alphaflag = true;
	normal = [];
	inputTriangles = [];
	inputTrianglesCopy = [];
	toCenter = [];
	toCenterCopy = [];
	lightLoc = [];
	eyeLoc = [];
	lookAtV = [];
	lookUp = [];
	newLook = [];
	snakeNodes = [];
	sindex = 14;
	NPsindex = 15;
	NPlastNodeP = NPsindex;
	sindexTemp = 14;
	NPsindexTemp = 15;
	sHead = 14;
	grid = [];
	snakeLen = 1;
	NPsnakeLen = 1;
	score = 0;
	lightingFlag = 0.0;
	selectCtr = -1;
	selectFlag = 0;
	xAngle = 0; yAngle = 0;
	hi = 1;
	hj = 1;
	ni = 8;
	nj = 8;
	hli = 1; hlj = 1;
	nli = 8; nlj = 8;
	initgrid();
}

function resetNP(){
	
	NPsnakeLen = 1;
	//console.log("NPSindexTemp:"+ NPsindexTemp);
	//console.log(inputTriangles);
	inputTrianglesCopy[NPsindex] = inputTriangles[NPsindexTemp] = {
		"mMatrix": mat4.create(),
		"material": {"ambient": [0.1,0.1,0.1], "diffuse": [1,1,1], "specular": [0.3,0.3,0.3], "n":3, "alpha": 1, "texture": "https://i.imgur.com/b8WlUJV.png"}, 
		"vertices": [[2.0, -2.0, 5.6],[1.5, -2.0, 5.6],[1.5, -1.5, 5.6],[2.0, -1.5, 5.6],
					 [1.5, -2.0, 5.6],[2.0, -2.0, 5.6],[2.0, -2.0, 6],[1.5, -2.0, 6],
					 [1.5, -2.0, 5.6],[1.5, -1.5, 5.6],[1.5, -1.5, 6],[1.5, -2, 6],
					 [2.0, -1.5, 5.6],[1.5, -1.5, 5.6],[1.5, -1.5, 6],[2.0, -1.5, 6],
					 [2.0, -2.0, 5.6],[2.0, -1.5, 5.6],[2.0, -1.5, 6],[2.0, -2.0, 6]],
		"normals": [[0, 0, -1],[0, 0, -1],[0, 0, -1],[0, 0, -1],
					[0, 1, 0],[0, 1, 0],[0, 1, -0],[0, 1, 0],
					[1,0,0],[1,0,0],[1,0,0],[1,0,0],
					[0,-1,0],[0,-1,0],[0,-1,0],[0,-1,0],
					[-1,0,0],[-1,0,0],[-1,0,0],[-1,0,0]],
		"uvs": [[0,0], [0,1], [1,1], [1,0],
				[0,0], [0,1], [.8,1], [.8,0],
				[0,0], [0,1], [.8,1], [.8,0],
				[0,0], [0,1], [.8,1], [.8,0],
				[0,0], [0,1], [.8,1], [.8,0]],
		"triangles": [[0,1,2],[2,3,0],[4,5,6],[6,7,4],[8,9,10],[10,11,8],[12,13,14],[14,15,12],[16,17,18],[18,19,16]],
		"xd": -0.5,
		"yd": 0,
		"type": "np"
	  };
	  
	NPlastNodeP = NPsindex;
	var count = 10;
	for(var j=0; j<count; j++){
		for(var k=0; k<count; k++){
			if(grid[j][k].type == "np")
			grid[j][k] = {"x":0, "y":0, "count":0, "occ":0, "type": ""};
		}
	}
	var x=0, y=0, z=0;
	for (var whichSetVert=0; whichSetVert<inputTrianglesCopy[NPsindex].vertices.length; whichSetVert++) {
		var vtxToAdd = inputTrianglesCopy[NPsindex].vertices[whichSetVert];
		
		x+=vtxToAdd[0];
		y+=vtxToAdd[1];
		z+=vtxToAdd[2];
		
	} // end for vertices in set
	x/=inputTrianglesCopy[NPsindex].vertices.length;
	y/=inputTrianglesCopy[NPsindex].vertices.length;
	z/=inputTrianglesCopy[NPsindex].vertices.length;
	toCenterCopy[NPsindex] = toCenter[NPsindexTemp] = [x,y,z];
	for(var i=NPsindex+1; i<inputTrianglesCopy.length; i++){
		if(inputTrianglesCopy[i].type == "np")
			inputTrianglesCopy[i].type = "";
	}
		ni = 8;
	nj = 8;
	nli = 8; nlj = 8;
}

function initgrid(){
	var count = 10;
	for(var i = 0; i < count; i++)
		grid[i] = [];
	for(var j=0; j<count; j++){
		for(var k=0; k<count; k++)
			grid[j][k] = {"x":0, "y":0, "count":0, "occ":0, "type": ""};
	}
}

function getLight(){
	var light = 
	[
	{"x": 0, "y": -6, "z": -4, "ambient": [1,1,1], "diffuse": [1,1,.8], "specular": [1,1,1]}
	];
	return light;
}

function getTestData(){
	var testJSON = 
	
	[
	  //Turf
	  {
		"material": {"ambient": [0.1,0.1,0.1], "diffuse": [0.7,0.8,0.5], "specular": [0.3,0.3,0.3], "n":3, "alpha": 0.9, "texture": "https://i.imgur.com/RG4wVi9.jpg"}, 
		"vertices": [[-2.5, -2.5, 6],[-2.5, 2.5, 6],[2.5,2.5,6],[2.5,-2.5,6]],
		"normals": [[0, 0, -1],[0, 0, -1],[0, 0, -1],[0, 0, -1]],
		"uvs": [[0,1], [0,0], [1,0], [1,1]],
		"triangles": [[0,1,2],[2,3,0]],
		"type": "field"
	  },
	  
	  //Walls
	  {
		"material": {"ambient": [0.1,0.1,0.1], "diffuse": [0.7,0.4,0.0], "specular": [0.3,0.3,0.3], "n":3, "alpha": 0.9, "texture": "https://i.imgur.com/guzf4BB.jpg"}, 
		"vertices": [[-2.5, -2.5, 6],[-2.5, -2.5, 5.5],[-2.5,2.5,5.5],[-2.5,2.5,6]],
		"normals": [[1, 0, 0],[1, 0, 0],[1, 0, 0],[1, 0, 0]],
		"uvs": [[0,1], [0,0], [8,0], [8,1]],
		"triangles": [[0,1,2],[2,3,0]],
		"type": "field"
	  },
	  
	  {
		"material": {"ambient": [0.1,0.1,0.1], "diffuse": [0.7,0.4,0.0], "specular": [0.3,0.3,0.3], "n":3, "alpha": 0.9, "texture": "https://i.imgur.com/guzf4BB.jpg"}, 
		"vertices": [[-2.5, 2.5, 6],[-2.5, 2.5, 5.5],[2.5,2.5,5.5],[2.5,2.5,6]],
		"normals": [[0, -1, 0],[0, -1, 0],[0, -1, 0],[0, -1, 0]],
		"uvs": [[0,1], [0,0], [8,0], [8,1]],
		"triangles": [[0,1,2],[2,3,0]],
		"type": "field"
	  },
	  {
		"material": {"ambient": [0.1,0.1,0.1], "diffuse": [0.7,0.4,0.0], "specular": [0.3,0.3,0.3], "n":3, "alpha": 0.9, "texture": "https://i.imgur.com/guzf4BB.jpg"}, 
		"vertices": [[2.5,2.5,6],[2.5,2.5,5.5],[2.5,-2.5,5.5],[2.5,-2.5,6]],
		"normals": [[-1, 0, 0],[-1, 0, 0],[-1, 0, 0],[-1, 0, 0]],
		"uvs": [[0,1], [0,0], [8,0], [8,1]],
		"triangles": [[0,1,2],[2,3,0]],
		"type": "field"
	  },
	  {
		"material": {"ambient": [0.1,0.1,0.1], "diffuse": [0.7,0.4,0.0], "specular": [0.3,0.3,0.3], "n":3, "alpha": 0.9, "texture": "https://i.imgur.com/guzf4BB.jpg"}, 
		"vertices": [[2.5, -2.5, 6],[2.5, -2.5, 5.5],[-2.5,-2.5,5.5],[-2.5,-2.5,6]],
		"normals": [[0, 1, 0],[0, 1, 0],[0, 1, 0],[0, 1, 0]],
		"uvs": [[0,1], [0,0], [8,0], [8,1]],
		"triangles": [[0,1,2],[2,3,0]],
		"type": "field"
	  },
	  {
		"material": {"ambient": [0.1,0.1,0.1], "diffuse": [0.7,0.4,0.0], "specular": [0.3,0.3,0.3], "n":3, "alpha": 0.9, "texture": "https://i.imgur.com/guzf4BB.jpg"}, 
		"vertices": [[-3, -3, 6],[-3, -3, 5.5],[-3,3,5.5],[-3,3,6]],
		"normals": [[-1, 0, 0],[-1, 0, 0],[-1, 0, 0],[-1, 0, 0]],
		"uvs": [[0,1], [0,0], [10,0], [10,1]],
		"triangles": [[0,1,2],[2,3,0]],
		"type": "field"
	  },
	  {
		"material": {"ambient": [0.1,0.1,0.1], "diffuse": [0.7,0.4,0.0], "specular": [0.3,0.3,0.3], "n":3, "alpha": 0.9, "texture": "https://i.imgur.com/guzf4BB.jpg"}, 
		"vertices": [[-3, 3, 6],[-3, 3, 5.5],[3,3,5.5],[3,3,6]],
		"normals": [[0, 1, 0],[0, 1, 0],[0, 1, 0],[0, 1, 0]],
		"uvs": [[0,1], [0,0], [10,0], [10,1]],
		"triangles": [[0,1,2],[2,3,0]],
		"type": "field"
	  },
	  {
		"material": {"ambient": [0.1,0.1,0.1], "diffuse": [0.7,0.4,0.0], "specular": [0.3,0.3,0.3], "n":3, "alpha": 0.9, "texture": "https://i.imgur.com/guzf4BB.jpg"}, 
		"vertices": [[3,3,6],[3,3,5.5],[3,-3,5.5],[3,-3,6]],
		"normals": [[1, 0, 0],[1, 0, 0],[1, 0, 0],[1, 0, 0]],
		"uvs": [[0,1], [0,0], [10,0], [10,1]],
		"triangles": [[0,1,2],[2,3,0]],
		"type": "field"
	  },
	  {
		"material": {"ambient": [0.1,0.1,0.1], "diffuse": [0.7,0.4,0.0], "specular": [0.3,0.3,0.3], "n":3, "alpha": 0.9, "texture": "https://i.imgur.com/guzf4BB.jpg"}, 
		"vertices": [[3, -3, 6],[3, -3, 5.5],[-3,-3,5.5],[-3,-3,6]],
		"normals": [[0, -1, 0],[0, -1, 0],[0, -1, 0],[0, -1, 0]],
		"uvs": [[0,1], [0,0], [10,0], [10,1]],
		"triangles": [[0,1,2],[2,3,0]],
		"type": "field"
	  },
	  {
		"material": {"ambient": [0.1,0.1,0.1], "diffuse": [0.7,0.4,0.0], "specular": [0.3,0.3,0.3], "n":3, "alpha": 0.9, "texture": "https://i.imgur.com/guzf4BB.jpg"}, 
		"vertices": [[-3, 3, 5.5],[-2.5, 3, 5.5],[-2.5,-3,5.5],[-3,-3,5.5]],
		"normals": [[0, 0, -1],[0, 0, -1],[0, 0, -1],[0, 0, -1]],
		"uvs": [[0,1], [0,0], [10,0], [10,1]],
		"triangles": [[0,1,2],[2,3,0]],
		"type": "field"
	  },
	  {
		"material": {"ambient": [0.1,0.1,0.1], "diffuse": [0.7,0.4,0.0], "specular": [0.3,0.3,0.3], "n":3, "alpha": 0.9, "texture": "https://i.imgur.com/guzf4BB.jpg"}, 
		"vertices": [[-2.5, -3, 5.5],[2.5, -3, 5.5],[2.5,-2.5,5.5],[-2.5,-2.5,5.5]],
		"normals": [[0, 0, -1],[0, 0, -1],[0, 0, -1],[0, 0, -1]],
		"uvs": [[0.5,0], [8.5,0], [8.5,1], [0.5,1]],
		"triangles": [[0,1,2],[2,3,0]],
		"type": "field"
	  },
	  {
		"material": {"ambient": [0.1,0.1,0.1], "diffuse": [0.7,0.4,0.0], "specular": [0.3,0.3,0.3], "n":3, "alpha": 0.9, "texture": "https://i.imgur.com/guzf4BB.jpg"}, 
		"vertices": [[-2.5, 3, 5.5],[2.5, 3, 5.5],[2.5,2.5,5.5],[-2.5,2.5,5.5]],
		"normals": [[0, 0, -1],[0, 0, -1],[0, 0, -1],[0, 0, -1]],
		"uvs": [[0.5,0], [8.5,0], [8.5,1], [0.5,1]],
		"triangles": [[0,1,2],[2,3,0]],
		"type": "field"
	  },
	  {
		"material": {"ambient": [0.1,0.1,0.1], "diffuse": [0.7,0.4,0.0], "specular": [0.3,0.3,0.3], "n":3, "alpha": 0.9, "texture": "https://i.imgur.com/guzf4BB.jpg"}, 
		"vertices": [[3, 3, 5.5],[2.5, 3, 5.5],[2.5,-3,5.5],[3,-3,5.5]],
		"normals": [[0, 0, -1],[0, 0, -1],[0, 0, -1],[0, 0, -1]],
		"uvs": [[0,1], [0,0], [10,0], [10,1]],
		"triangles": [[0,1,2],[2,3,0]],
		"type": "field"
	  },
	  // Food slot
	  {
		"material": {"ambient": [0.1,0.1,0.1], "diffuse": [1,1,1], "specular": [0.3,0.3,0.3], "n":3, "alpha": 0.9, "texture": "https://i.imgur.com/H1N2gBt.png"}, 
		"vertices": [[-2.0, 2.0, 5.6],[-1.5, 2.0, 5.6],[-1.5, 1.5, 5.6],[-2.0, 1.5, 5.6]],
		"normals": [[0, 0, -1],[0, 0, -1],[0, 0, -1],[0, 0, -1]],
		"uvs": [[1,1], [0,1], [0,0], [1,0]],
		"triangles": [[0,1,2],[2,3,0]],
		"type": "food"
	  },
	  //Snake Head
	  {
		"material": {"ambient": [0.1,0.1,0.1], "diffuse": [1,1,1], "specular": [0.3,0.3,0.3], "n":3, "alpha": 1, "texture": "https://i.imgur.com/7tio1Yd.jpg"}, 
		"vertices": [[-2.0, 2.0, 5.6],[-1.5, 2.0, 5.6],[-1.5, 1.5, 5.6],[-2.0, 1.5, 5.6],
					 [-1.5, 2.0, 5.6],[-2.0, 2.0, 5.6],[-2.0, 2.0, 6],[-1.5, 2.0, 6],
					 [-1.5, 2.0, 5.6],[-1.5, 1.5, 5.6],[-1.5, 1.5, 6],[-1.5, 2, 6],
					 [-2.0, 1.5, 5.6],[-1.5, 1.5, 5.6],[-1.5, 1.5, 6],[-2.0, 1.5, 6],
					 [-2.0, 2.0, 5.6],[-2.0, 1.5, 5.6],[-2.0, 1.5, 6],[-2.0, 2.0, 6]],
		"normals": [[0, 0, -1],[0, 0, -1],[0, 0, -1],[0, 0, -1],
					[0, 1, 0],[0, 1, 0],[0, 1, -0],[0, 1, 0],
					[1,0,0],[1,0,0],[1,0,0],[1,0,0],
					[0,-1,0],[0,-1,0],[0,-1,0],[0,-1,0],
					[-1,0,0],[-1,0,0],[-1,0,0],[-1,0,0]],
		"uvs": [[0,0], [0,1], [1,1], [1,0],
				[0,0], [0,1], [.8,1], [.8,0],
				[0,0], [0,1], [.8,1], [.8,0],
				[0,0], [0,1], [.8,1], [.8,0],
				[0,0], [0,1], [.8,1], [.8,0]],
		"triangles": [[0,1,2],[2,3,0],[4,5,6],[6,7,4],[8,9,10],[10,11,8],[12,13,14],[14,15,12],[16,17,18],[18,19,16]],
		"type": "p"
	  },
	  // NP
	  {
		"material": {"ambient": [0.1,0.1,0.1], "diffuse": [1,1,1], "specular": [0.3,0.3,0.3], "n":3, "alpha": 1, "texture": "https://i.imgur.com/b8WlUJV.png"}, 
		"vertices": [[2.0, -2.0, 5.6],[1.5, -2.0, 5.6],[1.5, -1.5, 5.6],[2.0, -1.5, 5.6],
					 [1.5, -2.0, 5.6],[2.0, -2.0, 5.6],[2.0, -2.0, 6],[1.5, -2.0, 6],
					 [1.5, -2.0, 5.6],[1.5, -1.5, 5.6],[1.5, -1.5, 6],[1.5, -2, 6],
					 [2.0, -1.5, 5.6],[1.5, -1.5, 5.6],[1.5, -1.5, 6],[2.0, -1.5, 6],
					 [2.0, -2.0, 5.6],[2.0, -1.5, 5.6],[2.0, -1.5, 6],[2.0, -2.0, 6]],
		"normals": [[0, 0, -1],[0, 0, -1],[0, 0, -1],[0, 0, -1],
					[0, 1, 0],[0, 1, 0],[0, 1, -0],[0, 1, 0],
					[1,0,0],[1,0,0],[1,0,0],[1,0,0],
					[0,-1,0],[0,-1,0],[0,-1,0],[0,-1,0],
					[-1,0,0],[-1,0,0],[-1,0,0],[-1,0,0]],
		"uvs": [[0,0], [0,1], [1,1], [1,0],
				[0,0], [0,1], [.8,1], [.8,0],
				[0,0], [0,1], [.8,1], [.8,0],
				[0,0], [0,1], [.8,1], [.8,0],
				[0,0], [0,1], [.8,1], [.8,0]],
		"triangles": [[0,1,2],[2,3,0],[4,5,6],[6,7,4],[8,9,10],[10,11,8],[12,13,14],[14,15,12],[16,17,18],[18,19,16]],
		"type": "np"
	  }
	  
	];
	//return JSON.parse(testJSON);
	return testJSON;
}

function getTexture(url, i){
	
	
	const img = new Image();
	//img.crossOrigin = "anonymous";
	img.crossOrigin = 'null';
	img.src = url;
	
	img.onload = function() {
	var texture = gl.createTexture();
	//////console.log(img);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	/*gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
                1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));*/
	//gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, img.width, img.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 511, 511]));
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
	
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.generateMipmap(gl.TEXTURE_2D);
	
	gl.bindTexture(gl.TEXTURE_2D, null);
	//texFlag = 1;
	
	triTex[i] = texture;texFlag++;
	
	if(url == "https://i.imgur.com/7tio1Yd.jpg"){
		//////console.log("Loading snake tex");
		snakeTex = texture;
	}
	
	if(texFlag < inputTriangles.length){
	//var url = "https://ncsucgclass.github.io/prog4/"+inputTriangles[i+1].material.texture;
	var url = inputTriangles[i+1].material.texture;
	
	getTexture(url, i+1);
	}
	
	if(texFlag == inputTriangles.length){
		//////console.log("Texture: alphaflag "+alphaflag);
		processTriangleData();
	}
	
	
	};
	//while(texFlag == 0);
	//return texture;
	
}

function depthSort(){
		
	var i, key, j, texKey, selChange = 0, centerKey; 
	//////console.log("Init select "+selectCtr);
		for (i = 1; i < inputTriangles.length; i++) 
		{ 
		   key = inputTriangles[i]; 
		   texKey = triTex[i];
		   centerKey = toCenter[i]
		   j = i-1; 
			while (j >= 0 && inputTriangles[j].depth < key.depth) 
		   { 
				if(j == selectCtr){
					selectCtr++;
					selChange = 1;
				}
			   inputTriangles[j+1] = inputTriangles[j]; 
			   triTex[j+1] = triTex[j];
			   toCenter[j+1] = toCenter[j];
			   j = j-1; 
		   } 
		   if(selectCtr == i && selChange == 0)
			   selectCtr = j+1;
		   inputTriangles[j+1] = key; 
		   if(i == sindexTemp)
			   sindexTemp = j+1;
		   if(i == NPsindexTemp)
			   NPsindexTemp = j+1;
			triTex[j+1] = texKey;
			toCenter[j+1]=centerKey;
		} 
		/* //console.log("Sindextemp:"+sindexTemp);
		//console.log(inputTriangles[sindexTemp]);
		 */
		//////console.log("Final Select "+selectCtr);
		//////console.log(inputTriangles);
}


// Key action mapped functions
var keyActionFunctions = [];

function deselectScaleTriangleSet(i){
	var setCenter1 = toCenter[i];
	//////console.log("Descale");
	//////console.log(selectCtr+":"+setCenter1);
	
	mat4.multiply(inputTriangles[i].mMatrix,
				 mat4.fromTranslation(mat4.create(),vec3.negate(vec3.create(),setCenter1)),
				 inputTriangles[i].mMatrix);
	mat4.multiply(inputTriangles[i].mMatrix,
                 mat4.fromScaling(mat4.create(),vec3.fromValues(.83,.83,.83)),
                 inputTriangles[i].mMatrix); 
	
	mat4.multiply(inputTriangles[i].mMatrix,
				 mat4.fromTranslation(mat4.create(),setCenter1),
				 inputTriangles[i].mMatrix);
}

function selectScaleTriangleSet(i){
	var setCenter1 = toCenter[i];
	
	mat4.multiply(inputTriangles[i].mMatrix,
				 mat4.fromTranslation(mat4.create(),vec3.negate(vec3.create(),setCenter1)),
				 inputTriangles[i].mMatrix);
	mat4.multiply(inputTriangles[i].mMatrix,
                 mat4.fromScaling(mat4.create(),vec3.fromValues(1.2,1.2,1.2)),
                 inputTriangles[i].mMatrix); 
	mat4.multiply(inputTriangles[i].mMatrix,
				 mat4.fromTranslation(mat4.create(),setCenter1),
				 inputTriangles[i].mMatrix);
}

keyActionFunctions['ArrowRight'] = function rightPressed(){
	//console.log("Right");
	if(keyFlag == 0)
	if(inputTrianglesCopy[sindex].yd != 0){
	keyFlag = 1;
	inputTrianglesCopy[sindex].xd = -0.5;
	inputTrianglesCopy[sindex].yd = 0;
	var x=toCenterCopy[sindex][0], y=toCenterCopy[sindex][1], z=toCenterCopy[sindex][2];
	grid[(x+2.25)/0.5][(2.25-y)/0.5].x = -0.5;
	grid[(x+2.25)/0.5][(2.25-y)/0.5].y = 0;
	grid[(x+2.25)/0.5][(2.25-y)/0.5].count = snakeLen;
	grid[(x+2.25)/0.5][(2.25-y)/0.5].type = "p";
	//console.log("Move grid:"+(x+2.25)/0.5+" "+(2.25-y)/0.5);
	//console.log(grid[(x+2.25)/0.5][(2.25-y)/0.5]);
	}	
}

keyActionFunctions['ArrowLeft'] = function leftPressed(){
	//console.log("Left");
	if(keyFlag == 0)
	if(inputTrianglesCopy[sindex].yd != 0){
			keyFlag = 1;
	inputTrianglesCopy[sindex].xd = 0.5;
	inputTrianglesCopy[sindex].yd = 0;
	var x=toCenterCopy[sindex][0], y=toCenterCopy[sindex][1], z=toCenterCopy[sindex][2];
	grid[(x+2.25)/0.5][(2.25-y)/0.5].x = 0.5;
	grid[(x+2.25)/0.5][(2.25-y)/0.5].y = 0;
	grid[(x+2.25)/0.5][(2.25-y)/0.5].count = snakeLen;
	grid[(x+2.25)/0.5][(2.25-y)/0.5].type = "p";
	//console.log("Move grid:"+(x+2.25)/0.5+" "+(2.25-y)/0.5);
	//console.log(grid[(x+2.25)/0.5][(2.25-y)/0.5]);
	
	}
}


keyActionFunctions['ArrowDown'] = function downPressed(){
	//console.log("Down");
	if(keyFlag == 0)
	if(inputTrianglesCopy[sindex].xd != 0){
			keyFlag = 1;
	inputTrianglesCopy[sindex].xd = 0;
	inputTrianglesCopy[sindex].yd = -0.5;
	var x=toCenterCopy[sindex][0], y=toCenterCopy[sindex][1], z=toCenterCopy[sindex][2];
	grid[(x+2.25)/0.5][(2.25-y)/0.5].x = 0;
	grid[(x+2.25)/0.5][(2.25-y)/0.5].y = -0.5;
	grid[(x+2.25)/0.5][(2.25-y)/0.5].count = snakeLen;
	grid[(x+2.25)/0.5][(2.25-y)/0.5].type = "p";
	//console.log("Move grid:"+(x+2.25)/0.5+" "+(2.25-y)/0.5);
	//console.log(grid[(x+2.25)/0.5][(2.25-y)/0.5]);
	
	}
		
}

keyActionFunctions['ArrowUp'] = function upPressed(){
	//console.log("Up");
	if(keyFlag == 0)
	if(inputTrianglesCopy[sindex].xd != 0){
		keyFlag = 1;
	inputTrianglesCopy[sindex].xd = 0;
	inputTrianglesCopy[sindex].yd = 0.5;
	var x=toCenterCopy[sindex][0], y=toCenterCopy[sindex][1], z=toCenterCopy[sindex][2];
	grid[(x+2.25)/0.5][(2.25-y)/0.5].x = 0;
	grid[(x+2.25)/0.5][(2.25-y)/0.5].y = 0.5;
	grid[(x+2.25)/0.5][(2.25-y)/0.5].count = snakeLen;
	grid[(x+2.25)/0.5][(2.25-y)/0.5].type = "p";
	//console.log("Move grid:"+(x+2.25)/0.5+" "+(2.25-y)/0.5);
	//console.log(grid[(x+2.25)/0.5][(2.25-y)/0.5]);
	}
		
}

// NP movement

function npRightPressed(){
	//console.log("NP Right");
	if(inputTrianglesCopy[NPsindex].yd != 0){
	inputTrianglesCopy[NPsindex].xd = -0.5;
	inputTrianglesCopy[NPsindex].yd = 0;
	var x=toCenterCopy[NPsindex][0], y=toCenterCopy[NPsindex][1], z=toCenterCopy[NPsindex][2];
	grid[(x+2.25)/0.5][(2.25-y)/0.5].x = -0.5;
	grid[(x+2.25)/0.5][(2.25-y)/0.5].y = 0;
	grid[(x+2.25)/0.5][(2.25-y)/0.5].count = NPsnakeLen;
	grid[(x+2.25)/0.5][(2.25-y)/0.5].type = "np";
	//console.log("Move grid:"+(x+2.25)/0.5+" "+(2.25-y)/0.5);
	//console.log(grid[(x+2.25)/0.5][(2.25-y)/0.5]);
	}	
}
function npLeftPressed(){
	//console.log("NP Left");
	if(inputTrianglesCopy[NPsindex].yd != 0){
	inputTrianglesCopy[NPsindex].xd = 0.5;
	inputTrianglesCopy[NPsindex].yd = 0;
	var x=toCenterCopy[NPsindex][0], y=toCenterCopy[NPsindex][1], z=toCenterCopy[NPsindex][2];
	grid[(x+2.25)/0.5][(2.25-y)/0.5].x = 0.5;
	grid[(x+2.25)/0.5][(2.25-y)/0.5].y = 0;
	grid[(x+2.25)/0.5][(2.25-y)/0.5].count = NPsnakeLen;
	grid[(x+2.25)/0.5][(2.25-y)/0.5].type = "np";
	//console.log("Move grid:"+(x+2.25)/0.5+" "+(2.25-y)/0.5);
	//console.log(grid[(x+2.25)/0.5][(2.25-y)/0.5]);
	
	}
}


function npDownPressed(){
	//console.log("NP Down");
	if(inputTrianglesCopy[NPsindex].xd != 0){
	inputTrianglesCopy[NPsindex].xd = 0;
	inputTrianglesCopy[NPsindex].yd = -0.5;
	var x=toCenterCopy[NPsindex][0], y=toCenterCopy[NPsindex][1], z=toCenterCopy[NPsindex][2];
	grid[(x+2.25)/0.5][(2.25-y)/0.5].x = 0;
	grid[(x+2.25)/0.5][(2.25-y)/0.5].y = -0.5;
	grid[(x+2.25)/0.5][(2.25-y)/0.5].count = NPsnakeLen;
	grid[(x+2.25)/0.5][(2.25-y)/0.5].type = "np";
	//console.log("Move grid:"+(x+2.25)/0.5+" "+(2.25-y)/0.5);
	//console.log(grid[(x+2.25)/0.5][(2.25-y)/0.5]);
	
	}
		
}

function npUpPressed(){
	//console.log("NP Up");
	if(inputTrianglesCopy[NPsindex].xd != 0){
	inputTrianglesCopy[NPsindex].xd = 0;
	inputTrianglesCopy[NPsindex].yd = 0.5;
	var x=toCenterCopy[NPsindex][0], y=toCenterCopy[NPsindex][1], z=toCenterCopy[NPsindex][2];
	grid[(x+2.25)/0.5][(2.25-y)/0.5].x = 0;
	grid[(x+2.25)/0.5][(2.25-y)/0.5].y = 0.5;
	grid[(x+2.25)/0.5][(2.25-y)/0.5].count = NPsnakeLen;
	grid[(x+2.25)/0.5][(2.25-y)/0.5].type = "np";
	//console.log("Move grid:"+(x+2.25)/0.5+" "+(2.25-y)/0.5);
	//console.log(grid[(x+2.25)/0.5][(2.25-y)/0.5]);
	}
		
}



// ASSIGNMENT HELPER FUNCTIONS

// Getting all GLSL variable locations
function getAllLocs(){
	GLSLLocs = {
		uniformLocations:{
			triColorLoc : gl.getUniformLocation(shaderProgram, "triColor"),
			ambColorLoc : gl.getUniformLocation(shaderProgram, "ambColor"),
			specColorLoc : gl.getUniformLocation(shaderProgram, "specColor"),
			specNLoc : gl.getUniformLocation(shaderProgram, "specN"),
			lightPosLoc : gl.getUniformLocation(shaderProgram, "lightLoc"),
			eyePosLoc : gl.getUniformLocation(shaderProgram, "eyeLoc"),
			modelMatLoc : gl.getUniformLocation(shaderProgram, "matModel"),
			pTransformLoc : gl.getUniformLocation(shaderProgram, "pTransform"),
			vTransformLoc : gl.getUniformLocation(shaderProgram, "vTransform"),
			kaLoc : gl.getUniformLocation(shaderProgram, "ka"),
			kdLoc : gl.getUniformLocation(shaderProgram, "kd"),
			ksLoc : gl.getUniformLocation(shaderProgram, "ks"),
			lightingFlagLoc : gl.getUniformLocation(shaderProgram, "lightingFlag"),
			alphaLoc : gl.getUniformLocation(shaderProgram, "alpha"),
			texSamplerLoc : gl.getUniformLocation(shaderProgram, "texSampler")
			
		},
		attributeLocations: {
			vertexPositionAttrib : gl.getAttribLocation(shaderProgram, "vertexPosition"),
			normalPositionAttrib : gl.getAttribLocation(shaderProgram, "normalPosition"),
			uvAttrib : gl.getAttribLocation(shaderProgram, "aVertexUv")
		}

	}
}

// get the JSON file from the passed URL
function getJSONFile(url,descr) {
    try {
        if ((typeof(url) !== "string") || (typeof(descr) !== "string"))
            throw "getJSONFile: parameter not a string";
        else {
            var httpReq = new XMLHttpRequest(); // a new http request
            httpReq.open("GET",url,false); // init the request
            httpReq.send(null); // send the request
            var startTime = Date.now();
            while ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE)) {
                if ((Date.now()-startTime) > 3000)
                    break;
            } // until its loaded or we time out after three seconds
            if ((httpReq.status !== 200) || (httpReq.readyState !== XMLHttpRequest.DONE))
                throw "Unable to open "+descr+" file!";
            else
                return JSON.parse(httpReq.response); 
        } // end if good params
    } // end try    
    
    catch(e) {
        //console.log(e);
        return(String.null);
    }
} // end get input json file



// set up the webGL environment
function setupWebGL() {

	var imageCanvas = document.getElementById("myImageCanvas"); // create a 2d canvas
      var cw = imageCanvas.width, ch = imageCanvas.height; 
      imageContext = imageCanvas.getContext("2d"); 
      var bkgdImage = new Image(); 
      bkgdImage.crossOrigin = "Anonymous";
      bkgdImage.src = "https://ncsucgclass.github.io/prog4/sky.jpg";
      bkgdImage.onload = function(){
          var iw = bkgdImage.width, ih = bkgdImage.height;
          imageContext.drawImage(bkgdImage,0,0,iw,ih,0,0,cw,ch);   
     } // end onload callback
    // Get the canvas and context

    var canvas = document.getElementById("myWebGLCanvas"); // create a js canvas
    gl = canvas.getContext("webgl"); // get a webgl object from it
    
    try {
      if (gl == null) {
        throw "unable to create gl context -- is your browser gl ready?";
      } else {
        gl.clearColor(0.0, 0.0, 0.0, 1.0); // use black when we clear the frame buffer
        gl.clearDepth(1.0); // use max when we clear the depth buffer
        gl.enable(gl.DEPTH_TEST); // use hidden surface removal (with zbuffering)
      }
    } // end try
    
    catch(e) {
      //console.log(e);
    } // end catch
 
} // end setupWebGL


function processTriangleDataCopy(){
	
	//requestAnimationFrame(processTriangleData);
	var whichSetVert; // index of vertex in current triangle set
	var whichSetTri; // index of triangle in current triangle set
	var whichSetNorm;
	var coordArray = []; // 1D array of vertex coords for WebGL


	//var indexArray = []; // 1D array of vertex indices for WebGL
	var normArray = [];
	var uvArray = [];
	var vtxBufferSize = 0; // the number of vertices in the vertex buffer
	var vtxToAdd = []; // vtx coords to add to the coord array
	var normToAdd = [];
	var uvToAdd = [];
	var indexOffset = vec3.create(); // the index offset for the current set
	var triToAdd = vec3.create(); // tri indices to add to the index array
	var normToAdd = vec3.create();
	var tempColor;
	
	var minX;
	//////console.log("Processing triangle...");

	for (var whichSet=0; whichSet<inputTriangles.length; whichSet++) {
		
		triBufferSize[whichSet] = 0;
		normalBufferSize = 0;
		inputTriangles[whichSet].indexArray = [];
		//vec3.set(indexOffset,vtxBufferSize,vtxBufferSize,vtxBufferSize); // update vertex offset
		minX = inputTriangles[whichSet].vertices[0].slice(0);
		alpha = inputTriangles[whichSet].material.alpha;
		//////console.log("i: "+whichSet+"; alpha: "+alpha+"; depth:"+inputTriangles[whichSet].depth);
		uvArray = [];
		normArray = [];
		var x = 0, y=0, z=0;
		var f = (alpha == 1.0)?true:false;
		//////console.log("Print opaque "+f+"; alphaflag "+alphaflag);
		if(f == alphaflag){
			//////console.log("Rendering "+whichSet+" with alpha "+alpha+"; image "+inputTriangles[whichSet].material.texture);
		// set up the vertex coord array
		for (whichSetVert=0; whichSetVert<inputTriangles[whichSet].vertices.length; whichSetVert++) {
			vtxToAdd = inputTriangles[whichSet].vertices[whichSetVert];
			if(vtxToAdd[0]<minX[0])
				minX = vtxToAdd.slice(0);
			x+=vtxToAdd[0];
			y+=vtxToAdd[1];
			z+=vtxToAdd[2];
			coordArray.push(vtxToAdd[0],vtxToAdd[1],vtxToAdd[2]);
			normToAdd = inputTriangles[whichSet].normals[whichSetVert];
			normArray.push(normToAdd[0],normToAdd[1],normToAdd[2]);
			uvToAdd = inputTriangles[whichSet].uvs[whichSetVert];
			//////console.log(uvToAdd);
			uvArray.push(uvToAdd[0], uvToAdd[1]);
		} // end for vertices in set
		x/=inputTriangles[whichSet].vertices.length;
		y/=inputTriangles[whichSet].vertices.length;
		z/=inputTriangles[whichSet].vertices.length;
		if(toCenter[whichSet] == undefined){
			toCenter[whichSet] = [x,y,z];
			//toCenter[whichSet] = minX.slice(0);
			
		}
		//////console.log("Tocenter "+whichSet+" "+toCenter[whichSet]);
		
		// set up the triangle index array, adjusting indices across sets
		for (whichSetTri=0; whichSetTri<inputTriangles[whichSet].triangles.length; whichSetTri++) {
			vec3.add(triToAdd,indexOffset,inputTriangles[whichSet].triangles[whichSetTri]);
			inputTriangles[whichSet].indexArray.push(triToAdd[0],triToAdd[1],triToAdd[2]);
		} // end for triangles in set
		
		
		tempColor = inputTriangles[whichSet].material.diffuse;
		color[0] = tempColor[0];
		color[1] = tempColor[1];
		color[2] = tempColor[2];
		//color[3] = 1.0;
		tempColor = inputTriangles[whichSet].material.ambient;
		ambColor[0] = tempColor[0];
		ambColor[1] = tempColor[1];
		ambColor[2] = tempColor[2];
		//ambColor[3] = 1.0;
		tempColor = inputTriangles[whichSet].material.specular;
		specColor[0] = tempColor[0];
		specColor[1] = tempColor[1];
		specColor[2] = tempColor[2];
		//specColor[3] = 1.0;
		
		specN = inputTriangles[whichSet].material.n;
		vtxBufferSize = inputTriangles[whichSet].vertices.length; // total number of vertices
		triBufferSize[whichSet] = (inputTriangles[whichSet].triangles.length)*3; 
		normalBufferSize = inputTriangles[whichSet].normals.length;
		uvBufferSize = inputTriangles[whichSet].uvs.length;
		
		
		// send the vertex coords to webGL
		vertexBuffer[whichSet] = gl.createBuffer(); // init empty vertex coord buffer
		gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer[whichSet]); // activate that buffer
		gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(coordArray),gl.STATIC_DRAW); // coords to that buffer
		

		// send the triangle indices to webGL
		triangleBuffer[whichSet] = gl.createBuffer(); // init empty triangle index buffer
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer[whichSet]); // activate that buffer
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(inputTriangles[whichSet].indexArray),gl.STATIC_DRAW); // indices to that buffer
		
		//////console.log(normArray);
		normalBuffer[whichSet] = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER,normalBuffer[whichSet]);
		gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(normArray),gl.STATIC_DRAW);
		
		uvBuffer[whichSet] = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER,uvBuffer[whichSet]);
		gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(uvArray),gl.STATIC_DRAW);
	
		if(inputTriangles[whichSet].mMatrix == undefined){
			//////console.log("Test");
			
			inputTriangles[whichSet].mMatrix = mat4.create();
			//////console.log(inputTriangles[whichSet].mMatrix);
		}
		
		
		
		
		
		
		setupShaders();
		renderTriangles(whichSet);
		
		coordArray = [];
		//indexArray = [];
		}
	}
	if(alphaflag == true){
		alphaflag = false;
		gl.depthMask(false);
		gl.enable(gl.DEPTH_TEST)
		//gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
		//gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
		processTriangleData();
	}
	else{
		gl.depthMask(true);
		alphaflag = true;
		//////console.log(inputTriangles.length);
		snakeMov();
	}
}

function getFood(){
	var ri = Math.floor((Math.random() * 10) + 0);
	//var ri = 8;
	var rj = Math.floor((Math.random() * 10) + 0);
	//var r = Math.random()*1 + 0;
	//var g = Math.random() * 1 + 0;
	//var b = Math.random() * 0.2 + 0;
	var r = 1, g = 0, b = 0;
	var foodVar = {
		"material": {"ambient": [0.1,0.1,0.1], "diffuse": [r,g,0], "specular": [0.3,0.3,0.3], "n":3, "alpha": 0.9, "texture": "https://i.imgur.com/H1N2gBt.png"}, 
		"vertices": [[-2.5+rj*0.5, 2.5-ri*0.5, 5.6],[-2.5+(rj+1)*0.5, 2.5-ri*0.5, 5.6],[-2.5+(rj+1)*0.5, 2.5-(ri+1)*0.5, 5.6],[-2.5+(rj)*0.5, 2.5-(ri+1)*0.5, 5.6]],
		"normals": [[0, 0, -1],[0, 0, -1],[0, 0, -1],[0, 0, -1]],
		"uvs": [[1,1], [0,1], [0,0], [1,0]],
		"triangles": [[0,1,2],[2,3,0]],
		"type": "food"
	  };
	  inputTriangles[food] = foodVar;
	var x=0, y=0, z=0;
	
	for (var whichSetVert=0; whichSetVert<inputTriangles[food].vertices.length; whichSetVert++) {
			var vtxToAdd = inputTriangles[food].vertices[whichSetVert];
			
			x+=vtxToAdd[0];
			y+=vtxToAdd[1];
			z+=vtxToAdd[2];
			
		}
		
	x/=inputTriangles[food].vertices.length;
	y/=inputTriangles[food].vertices.length;
	z/=inputTriangles[food].vertices.length;
	toCenter[food] = [x,y,z];
	inputTriangles[food].mMatrix = mat4.create();
	var setCenter1 = toCenter[food];
	/*mat4.multiply(inputTriangles[food].mMatrix,
						 mat4.fromTranslation(mat4.create(),vec3.negate(vec3.create(),setCenter1)),
						 inputTriangles[food].mMatrix);
			mat4.multiply(inputTriangles[food].mMatrix,
						 mat4.fromRotation(mat4.create(),-1*Math.PI/4,vec3.fromValues(1,0,0)),
						 inputTriangles[food].mMatrix); 
			mat4.multiply(inputTriangles[food].mMatrix,
						 mat4.fromTranslation(mat4.create(),setCenter1),
						 inputTriangles[food].mMatrix);
			mat4.multiply(inputTriangles[food].mMatrix,
						 mat4.fromTranslation(mat4.create(),vec3.create(0,0,1)),
						 inputTriangles[food].mMatrix); */
				
	foodLoc = [x,y,z];
	if(grid[(x+2.25)/0.5][(2.25-y)/0.5].occ == 1)
		getFood();
	
	 
	
}

function processTriangleData(){
	
	animReq = requestAnimationFrame(processTriangleData);
	
	var whichSetVert; // index of vertex in current triangle set
	var whichSetTri; // index of triangle in current triangle set
	var whichSetNorm;
	var coordArray = []; // 1D array of vertex coords for WebGL


	//var indexArray = []; // 1D array of vertex indices for WebGL
	var normArray = [];
	var uvArray = [];
	var vtxBufferSize = 0; // the number of vertices in the vertex buffer
	var vtxToAdd = []; // vtx coords to add to the coord array
	var normToAdd = [];
	var uvToAdd = [];
	var indexOffset = vec3.create(); // the index offset for the current set
	var triToAdd = vec3.create(); // tri indices to add to the index array
	var normToAdd = vec3.create();
	var tempColor;
	
	var minX;
	//////console.log("Processing triangle...");

	for (var whichSet=0; whichSet<inputTriangles.length; whichSet++) {
		
		triBufferSize[whichSet] = 0;
		normalBufferSize = 0;
		inputTriangles[whichSet].indexArray = [];
		//vec3.set(indexOffset,vtxBufferSize,vtxBufferSize,vtxBufferSize); // update vertex offset
		minX = inputTriangles[whichSet].vertices[0].slice(0);
		alpha = inputTriangles[whichSet].material.alpha;
		//////console.log("i: "+whichSet+"; alpha: "+alpha+"; depth:"+inputTriangles[whichSet].depth);
		uvArray = [];
		normArray = [];
		var x = 0, y=0, z=0;
		var f = (alpha == 1.0)?true:false;
		//////console.log("Print opaque "+f+"; alphaflag "+alphaflag);
		if(f == alphaflag){
			//////console.log("Rendering "+whichSet+" with alpha "+alpha+"; image "+inputTriangles[whichSet].material.texture);
		// set up the vertex coord array
		for (whichSetVert=0; whichSetVert<inputTriangles[whichSet].vertices.length; whichSetVert++) {
			vtxToAdd = inputTriangles[whichSet].vertices[whichSetVert];
			if(vtxToAdd[0]<minX[0])
				minX = vtxToAdd.slice(0);
			x+=vtxToAdd[0];
			y+=vtxToAdd[1];
			z+=vtxToAdd[2];
			coordArray.push(vtxToAdd[0],vtxToAdd[1],vtxToAdd[2]);
			normToAdd = inputTriangles[whichSet].normals[whichSetVert];
			normArray.push(normToAdd[0],normToAdd[1],normToAdd[2]);
			uvToAdd = inputTriangles[whichSet].uvs[whichSetVert];
			//////console.log(uvToAdd);
			uvArray.push(uvToAdd[0], uvToAdd[1]);
		} // end for vertices in set
		x/=inputTriangles[whichSet].vertices.length;
		y/=inputTriangles[whichSet].vertices.length;
		z/=inputTriangles[whichSet].vertices.length;
		if(toCenter[whichSet] == undefined){
			toCenter[whichSet] = [x,y,z];
			//toCenter[whichSet] = minX.slice(0);
			
		}
		//////console.log("Tocenter "+whichSet+" "+toCenter[whichSet]);
		
		// set up the triangle index array, adjusting indices across sets
		for (whichSetTri=0; whichSetTri<inputTriangles[whichSet].triangles.length; whichSetTri++) {
			vec3.add(triToAdd,indexOffset,inputTriangles[whichSet].triangles[whichSetTri]);
			inputTriangles[whichSet].indexArray.push(triToAdd[0],triToAdd[1],triToAdd[2]);
		} // end for triangles in set
		
		
		tempColor = inputTriangles[whichSet].material.diffuse;
		color[0] = tempColor[0];
		color[1] = tempColor[1];
		color[2] = tempColor[2];
		//color[3] = 1.0;
		tempColor = inputTriangles[whichSet].material.ambient;
		ambColor[0] = tempColor[0];
		ambColor[1] = tempColor[1];
		ambColor[2] = tempColor[2];
		//ambColor[3] = 1.0;
		tempColor = inputTriangles[whichSet].material.specular;
		specColor[0] = tempColor[0];
		specColor[1] = tempColor[1];
		specColor[2] = tempColor[2];
		//specColor[3] = 1.0;
		
		specN = inputTriangles[whichSet].material.n;
		vtxBufferSize = inputTriangles[whichSet].vertices.length; // total number of vertices
		triBufferSize[whichSet] = (inputTriangles[whichSet].triangles.length)*3; 
		normalBufferSize = inputTriangles[whichSet].normals.length;
		uvBufferSize = inputTriangles[whichSet].uvs.length;
		
		
		// send the vertex coords to webGL
		vertexBuffer[whichSet] = gl.createBuffer(); // init empty vertex coord buffer
		gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer[whichSet]); // activate that buffer
		gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(coordArray),gl.STATIC_DRAW); // coords to that buffer
		

		// send the triangle indices to webGL
		triangleBuffer[whichSet] = gl.createBuffer(); // init empty triangle index buffer
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer[whichSet]); // activate that buffer
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(inputTriangles[whichSet].indexArray),gl.STATIC_DRAW); // indices to that buffer
		
		//////console.log(normArray);
		normalBuffer[whichSet] = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER,normalBuffer[whichSet]);
		gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(normArray),gl.STATIC_DRAW);
		
		uvBuffer[whichSet] = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER,uvBuffer[whichSet]);
		gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(uvArray),gl.STATIC_DRAW);
	
		if(inputTriangles[whichSet].mMatrix == undefined){
			//////console.log("Test");
			
			inputTriangles[whichSet].mMatrix = mat4.create();
			//////console.log(inputTriangles[whichSet].mMatrix);
		}
		
		
		
		
		
		
		setupShaders();
		renderTriangles(whichSet);
		
		coordArray = [];
		//indexArray = [];
		}
	}
	if(alphaflag == true){
		alphaflag = false;
		gl.depthMask(false);
		gl.enable(gl.DEPTH_TEST)
		//gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
		//gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
		processTriangleDataCopy();
	}
	else{
		gl.depthMask(true);
		alphaflag = true;
		//////console.log(inputTriangles.length);
		snakeMov();
	}
}

function addNode(val){
	//console.log("ADD!");
	var center, vers, xd, yd, type;
	if(val == 0){
		center = toCenterCopy[lastNodeP];	
		xd = inputTrianglesCopy[lastNodeP].xd;
		yd = inputTrianglesCopy[lastNodeP].yd;
		type = "p";
		vers = [[center[0]-.25, center[1]+.25, 5.6],[center[0]+.25, center[1]+.25, 5.6],[center[0]+.25, center[1]-.25, 5.6],[center[0]-.25, center[1]-.25, 5.6],
				[center[0]-.25+.5, center[1]+.25, 5.6],[center[0]+.25-.5, center[1]+.25, 5.6],[center[0]+.25-.5, center[1]-.25+.5, 6],[center[0]-.25+.5, center[1]-.25+.5, 6],
				 [center[0]-.25+.5, center[1]+.25, 5.6],[center[0]+.25, center[1]-.25, 5.6],[center[0]+.25, center[1]-.25, 6],[center[0]-.25+.5, center[1]-.25+.5, 6],
				 [center[0]-.25, center[1]-.25, 5.6],[center[0]+.25, center[1]-.25, 5.6],[center[0]+.25, center[1]-.25, 6],[center[0]-.25, center[1]-.25, 6],
				 [center[0]-.25, center[1]+.25, 5.6],[center[0]-.25, center[1]-.25, 5.6],[center[0]-.25, center[1]-.25, 6],[center[0]-.25, center[1]+.25, 6]];
	}
	else{
		center = toCenterCopy[NPlastNodeP];	
		xd = inputTrianglesCopy[NPlastNodeP].xd;
		yd = inputTrianglesCopy[NPlastNodeP].yd;
		type = "np";
		vers = [[center[0]+.25, center[1]-.25, 5.6],[center[0]-.25, center[1]-.25, 5.6],[center[0]-.25, center[1]+.25, 5.6],[center[0]+.25, center[1]+.25, 5.6],
				[center[0]+.25-.5, center[1]-.25, 5.6],[center[0]-.25+.5, center[1]-.25, 5.6],[center[0]-.25+.5, center[1]+.25-.5, 6],[center[0]+.25-.5, center[1]+.25-.5, 6],
				 [center[0]+.25-.5, center[1]-.25, 5.6],[center[0]-.25, center[1]+.25, 5.6],[center[0]-.25, center[1]+.25, 6],[center[0]+.25-.5, center[1]+.25-.5, 6],
				 [center[0]+.25, center[1]+.25, 5.6],[center[0]-.25, center[1]+.25, 5.6],[center[0]-.25, center[1]+.25, 6],[center[0]+.25, center[1]+.25, 6],
				 [center[0]+.25, center[1]-.25, 5.6],[center[0]+.25, center[1]+.25, 5.6],[center[0]+.25, center[1]+.25, 6],[center[0]+.25, center[1]-.25, 6]];
	}
	
	
	
	//console.log(inputTrianglesCopy);
	//console.log("Old to center:");
	//console.log(center);
	
	var newNode = {
		"material": {"ambient": [0.1,0.1,0.1], "diffuse": [1,1,1], "specular": [0.3,0.3,0.3], "n":3, "alpha": 1, "texture": "https://i.imgur.com/7tio1Yd.jpg"}, 
		"vertices": vers,
		"normals": [[0, 0, -1],[0, 0, -1],[0, 0, -1],[0, 0, -1],
					[0, 1, 0],[0, 1, 0],[0, 1, -0],[0, 1, 0],
					[1,0,0],[1,0,0],[1,0,0],[1,0,0],
					[0,-1,0],[0,-1,0],[0,-1,0],[0,-1,0],
					[-1,0,0],[-1,0,0],[-1,0,0],[-1,0,0]],
		"uvs": [[0,0], [0,1], [1,1], [1,0],
				[0,0], [0,1], [.8,1], [.8,0],
				[0,0], [0,1], [.8,1], [.8,0],
				[0,0], [0,1], [.8,1], [.8,0],
				[0,0], [0,1], [.8,1], [.8,0]],
		"triangles": [[0,1,2],[2,3,0],[4,5,6],[6,7,4],[8,9,10],[10,11,8],[12,13,14],[14,15,12],[16,17,18],[18,19,16]],
		"mMatrix": mat4.create(),
		"xd": xd,
		"yd": yd,
		"depth": 5.6,
		"type": type
	  };
	  
	//console.log("Added new node:");
	//console.log(newNode);
/*
	//console.log("Last");
	//console.log(inputTrianglesCopy[lastNodeP]);
	*/
	if(newNode.xd != 0){
		//console.log("Move x");
		
		mat4.multiply(newNode.mMatrix,
				 mat4.fromTranslation(mat4.create(),vec3.fromValues(-1*newNode.xd,0,0)),
				 newNode.mMatrix);
			
	}
	if(newNode.yd != 0){
		//console.log("Move y");
		
		mat4.multiply(newNode.mMatrix,
				 mat4.fromTranslation(mat4.create(),vec3.fromValues(0,-1*newNode.yd,0)),
				 newNode.mMatrix);

	}/*
	//console.log("Last");
	//console.log(inputTrianglesCopy[lastNodeP]);
	*/
	//console.log("New");
	
	//console.log(newNode);
	var newVal = inputTriangles.length;
	inputTriangles[newVal] = newNode;
	inputTrianglesCopy[newVal] = newNode;
	var  temp;
	if(val == 0){
		triTex[newVal] = triTex[sindexTemp];
		temp = toCenterCopy[lastNodeP];
		lastNodeP = newVal;
		snakeLen++;
		for(var i=0; i<10; i++)
		for(var j=0; j<10; j++){
			if(grid[i][j].type == "p" && grid[i][j].count!=0)
				grid[i][j].count++;
		}
	}
	else{
		triTex[newVal] = triTex[NPsindexTemp];
		temp = toCenterCopy[NPlastNodeP];
		NPlastNodeP = newVal;
		NPsnakeLen++;
		for(var i=0; i<10; i++)
		for(var j=0; j<10; j++){
			if(grid[i][j].type == "np" && grid[i][j].count!=0)
				grid[i][j].count++;
		}
	}
	
	toCenter[newVal] = toCenterCopy[newVal] = [temp[0]-newNode.xd,temp[1]-newNode.yd,temp[2]];
	
	
	
	
	//console.log("New to center:");
	//console.log(toCenterCopy[newVal]);

	
	//////console.log(snakeTex);
	
	
}
var c = 0;
function snakeMov(){
	// Snake
	
	var tempCenter = toCenterCopy[NPsindex];
	if(tempCenter[0] > 2.25 || tempCenter[0] < -2.25 || tempCenter[1] > 2.25 || tempCenter[1] < -2.25){
		//console.log("NP out of bounds");
		resetNP();
		
		/*
		//////console.log("Out of bounds");
		cancelAnimationFrame(animReq);
		alert("Face, meet wall... \n\nYour score is "+score+". Try again!");
		score = 0;
		gl.clearColor(0,0,0,0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
		alphaflag = true;
		resetAll();
		loadTrianglesAndRender();
		*/
	}
	else if(grid[(tempCenter[0]+2.25)/0.5][(2.25-tempCenter[1])/0.5].occ == 1 && grid[(tempCenter[0]+2.25)/0.5][(2.25-tempCenter[1])/0.5].type == "p" && grid[(tempCenter[0]+2.25)/0.5][(2.25-tempCenter[1])/0.5].count>0){
		cancelAnimationFrame(animReq);
		var hv = Number(document.getElementById("Highv").textContent);
		//console.log("High sc:"+hv);
		if(score > hv)
			document.getElementById("Highv").innerHTML = score;
		alert("You got bit! \n\nYour score is "+score+". Try again!");
		score = 0;
		
		document.getElementById("Scorev").innerHTML = score;
		gl.clearColor(0,0,0,0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
		alphaflag = true;
		resetAll();
		loadTrianglesAndRender();
	}
	else if(grid[(tempCenter[0]+2.25)/0.5][(2.25-tempCenter[1])/0.5].occ == 1 && grid[(tempCenter[0]+2.25)/0.5][(2.25-tempCenter[1])/0.5].type == "np"){
		//console.log("NP hit itself");
		//console.log("grid "+(tempCenter[0]+2.25)/0.5+"; "+(2.25-tempCenter[1])/0.5);
		//console.log(grid[(tempCenter[0]+2.25)/0.5][(2.25-tempCenter[1])/0.5]);
		resetNP();
		/*
		cancelAnimationFrame(animReq);
		alert("Oops, ran out of space? \n\nYour score is "+score+". Try again!");
		score = 0;
		gl.clearColor(0,0,0,0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
		alphaflag = true;
		resetAll();
		loadTrianglesAndRender();*/
	}
	
	tempCenter = toCenterCopy[sindex];
	if(tempCenter[0] > 2.25 || tempCenter[0] < -2.25 || tempCenter[1] > 2.25 || tempCenter[1] < -2.25){
		//////console.log("Out of bounds");
		cancelAnimationFrame(animReq);
		var hv = Number(document.getElementById("Highv").textContent);
		//console.log("High sc:"+hv);
		if(score > hv)
			document.getElementById("Highv").innerHTML = score;
		alert("Face, meet wall... \n\nYour score is "+score+". Try again!");
		score = 0;
		
		document.getElementById("Scorev").innerHTML = score;
		gl.clearColor(0,0,0,0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
		alphaflag = true;
		resetAll();
		loadTrianglesAndRender();
	}
	else if(grid[(tempCenter[0]+2.25)/0.5][(2.25-tempCenter[1])/0.5].occ == 1 && grid[(tempCenter[0]+2.25)/0.5][(2.25-tempCenter[1])/0.5].type == "p"){
		cancelAnimationFrame(animReq);
		var hv = Number(document.getElementById("Highv").textContent);
		//console.log("High sc:"+hv);
		if(score > hv)
			document.getElementById("Highv").innerHTML = score;
		alert("Oops, ran out of space? \n\nYour score is "+score+". Try again!");
		score = 0;
		
		document.getElementById("Scorev").innerHTML = score;
		
		
		gl.clearColor(0,0,0,0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
		alphaflag = true;
		resetAll();
		loadTrianglesAndRender();
	}
	else if((grid[(tempCenter[0]+2.25)/0.5][(2.25-tempCenter[1])/0.5].occ == 1 && grid[(tempCenter[0]+2.25)/0.5][(2.25-tempCenter[1])/0.5].type == "np" && grid[(tempCenter[0]+2.25)/0.5][(2.25-tempCenter[1])/0.5].count > 0)  || (hi == nli && hj == nlj) || (ni == hli && nj == hlj) || ((tempCenter[0]+2.25)/0.5 == nli && (2.25-tempCenter[1])/0.5 == nlj)|| ((tempCenter[0]+2.25)/0.5 == ni && (2.25-tempCenter[1])/0.5 == nj)){
		cancelAnimationFrame(animReq);
		//console.log("hi:"+hi+";hj:"+hj+";ni:"+ni+";nj:"+nj+";nli:"+nli+";nlj:"+nlj);
		//console.log(grid[(tempCenter[0]+2.25)/0.5][(2.25-tempCenter[1])/0.5]);
		var hv = Number(document.getElementById("Highv").textContent);
		//console.log("High sc:"+hv);
		if(score > hv)
			document.getElementById("Highv").innerHTML = score;
		
		document.getElementById("Scorev").innerHTML = score;
		alert("You hit the snake \n\nYour score is "+score+". Try again!");
		score = 0;
		gl.clearColor(0,0,0,0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
		alphaflag = true;
		resetAll();
		loadTrianglesAndRender();
	}
	else{
		if(gameCtr % speed == 0){
			//gameCtr++;
		
		c = 0;
	for(var i = sindex; i<inputTrianglesCopy.length; i++){
		if(inputTrianglesCopy[i].type == "p"){
		//console.log("Index "+i+": toCenter:"+toCenterCopy[i]+", xd:"+inputTrianglesCopy[i].xd+", yd:"+inputTrianglesCopy[i].yd+", length:"+inputTrianglesCopy.length);
		var x=toCenterCopy[i][0], y=toCenterCopy[i][1], z=toCenterCopy[i][2];
		tempCenter = toCenterCopy[i];
		if(i == sindex)
		if(tempCenter[0] == foodLoc[0] && tempCenter[1] == foodLoc[1]){
			score++;
			document.getElementById("Scorev").innerHTML = score;
			for(var i=0; i<inputTriangles.length; i++){
				if(inputTriangles[i].material.texture == "https://i.imgur.com/H1N2gBt.png")
					food = i;
			}
			getFood();
			addNode(0);
			break;
		}
		//////console.log(x);
		
		if(i == sindex){
			if(keyFlag == 1)
				keyFlag = 0;
			hi = (x+2.25)/0.5;
			hj = (2.25-y)/0.5;
			grid[(x+2.25)/0.5][(2.25-y)/0.5].occ = 1;
			grid[(x+2.25)/0.5][(2.25-y)/0.5].count = snakeLen;
			
			grid[(x+2.25)/0.5][(2.25-y)/0.5].type = "p";
			
		}
		
		if(grid[(x+2.25)/0.5][(2.25-y)/0.5].x != 0 || grid[(x+2.25)/0.5][(2.25-y)/0.5].y != 0){
			
			inputTriangles[i].xd = grid[(x+2.25)/0.5][(2.25-y)/0.5].x;
			inputTriangles[i].yd = grid[(x+2.25)/0.5][(2.25-y)/0.5].y;
			grid[(x+2.25)/0.5][(2.25-y)/0.5].count--;
			
			if(grid[(x+2.25)/0.5][(2.25-y)/0.5].count == 0){
				grid[(x+2.25)/0.5][(2.25-y)/0.5].x = 0;
				grid[(x+2.25)/0.5][(2.25-y)/0.5].y = 0;
			}
			
		}
		else
			grid[(x+2.25)/0.5][(2.25-y)/0.5].count--;
		//console.log("Grid now:"+ (x+2.25)/0.5+" "+(2.25-y)/0.5);
		//console.log(grid[(x+2.25)/0.5][(2.25-y)/0.5]);
		
		if(i == lastNodeP || grid[(x+2.25)/0.5][(2.25-y)/0.5].count == 0){
			grid[(x+2.25)/0.5][(2.25-y)/0.5].occ = 0;
			grid[(x+2.25)/0.5][(2.25-y)/0.5].type = "";
		}
		
		if(i == lastNodeP){
			hli = (x+2.25)/0.5;
			hlj = (2.25-y)/0.5;
			
		}
		
		//////console.log(inputTrianglesCopy[i].xd+" "+inputTrianglesCopy[i].yd);
		mat4.multiply(inputTrianglesCopy[i].mMatrix,
				 mat4.fromTranslation(mat4.create(),vec3.fromValues(inputTrianglesCopy[i].xd,inputTrianglesCopy[i].yd,0)),
				 inputTrianglesCopy[i].mMatrix);
		tempCenter[0]+=inputTrianglesCopy[i].xd;
		tempCenter[1]+=inputTrianglesCopy[i].yd;
	toCenterCopy[i] = tempCenter;
		
		
		
		
		//console.log("To Center for "+i+":");
		//console.log(toCenterCopy[i]);
		
		//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		}
	}
	//var tempCenter = toCenterCopy[sHead];
	//////console.log("Center:"+tempCenter);
	}
	}
	
	// NP snake
	//console.log("NP Counter is "+snakeCtr);
	if(snakeCtr == 0){
	snakeCtr = Math.floor(Math.random()*6 + 1);
	//console.log("New ctr is "+snakeCtr);
	var ri = Math.floor((Math.random() * 4) + 0);
	switch(ri){
		case 0: //console.log("NP right");
				npRightPressed();
				break;
		case 1: npLeftPressed();
				break;
		case 2: npUpPressed();
				break;
		case 3: npDownPressed();
				break;
	}
	}
	
	//else{
		if(gameCtr% speed == 0){
		c = 0;
		
	for(var i = sindex; i<inputTrianglesCopy.length; i++){
		if(inputTrianglesCopy[i].type == "np"){
		//console.log("Index "+i+": toCenter:"+toCenterCopy[i]+", xd:"+inputTrianglesCopy[i].xd+", yd:"+inputTrianglesCopy[i].yd+", length:"+inputTrianglesCopy.length);
		var x=toCenterCopy[i][0], y=toCenterCopy[i][1], z=toCenterCopy[i][2];
		tempCenter = toCenterCopy[i];
		if(i == NPsindex)
		if(tempCenter[0] == foodLoc[0] && tempCenter[1] == foodLoc[1]){
			score++;
			document.getElementById("Scorev").innerHTML = score;
			for(var i=0; i<inputTriangles.length; i++){
				if(inputTriangles[i].material.texture == "https://i.imgur.com/H1N2gBt.png")
					food = i;
			}
			getFood();
			addNode(1);
			break;
		}
		//////console.log(x);
		//console.log("current grid:"+(x+2.25)/0.5+" "+(2.25-y)/0.5);
		//console.log(grid[(x+2.25)/0.5][(2.25-y)/0.5]);
		if(i == NPsindex){
			ni = (x+2.25)/0.5;
			nj = (2.25-y)/0.5;
			grid[(x+2.25)/0.5][(2.25-y)/0.5].occ = 1;
			grid[(x+2.25)/0.5][(2.25-y)/0.5].count = NPsnakeLen;
			if(grid[(x+2.25)/0.5][(2.25-y)/0.5].type == "p"){
				cancelAnimationFrame(animReq);
				var hv = Number(document.getElementById("Highv").textContent);
				//console.log("High sc:"+hv);
				if(score > hv)
					document.getElementById("Highv").innerHTML = score;
				alert("You got bit! \n\nYour score is "+score+". Try again!");
				score = 0;
				document.getElementById("Scorev").innerHTML = score;
				
				gl.clearColor(0,0,0,0);
				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
				alphaflag = true;
				resetAll();
				loadTrianglesAndRender();
			}
			grid[(x+2.25)/0.5][(2.25-y)/0.5].type = "np";
			
		}
		
		if(grid[(x+2.25)/0.5][(2.25-y)/0.5].x != 0 || grid[(x+2.25)/0.5][(2.25-y)/0.5].y != 0){
			inputTriangles[i].xd = grid[(x+2.25)/0.5][(2.25-y)/0.5].x;
			inputTriangles[i].yd = grid[(x+2.25)/0.5][(2.25-y)/0.5].y;
			grid[(x+2.25)/0.5][(2.25-y)/0.5].count--;
			
			if(grid[(x+2.25)/0.5][(2.25-y)/0.5].count == 0){
				grid[(x+2.25)/0.5][(2.25-y)/0.5].x = 0;
				grid[(x+2.25)/0.5][(2.25-y)/0.5].y = 0;
			}
			
		}
		else
			grid[(x+2.25)/0.5][(2.25-y)/0.5].count--;
		//console.log("Grid now:"+ (x+2.25)/0.5+" "+(2.25-y)/0.5);
		//console.log(grid[(x+2.25)/0.5][(2.25-y)/0.5]);
		
		if(i == NPlastNodeP || (i == NPsindex && NPsnakeLen == 1)){
			nli = (x+2.25)/0.5;
			nlj = (2.25-y)/0.5;
			//console.log("Clearing NP");
			//console.log("nli "+nli+" nlj "+nlj);
			grid[(x+2.25)/0.5][(2.25-y)/0.5].occ = 0;
			grid[(x+2.25)/0.5][(2.25-y)/0.5].type = "";
		}
		if(inputTrianglesCopy[i].mMatrix == undefined)
			inputTrianglesCopy[i].mMatrix = mat4.create();
		//////console.log(inputTrianglesCopy[i].xd+" "+inputTrianglesCopy[i].yd);
		mat4.multiply(inputTrianglesCopy[i].mMatrix,
				 mat4.fromTranslation(mat4.create(),vec3.fromValues(inputTrianglesCopy[i].xd,inputTrianglesCopy[i].yd,0)),
				 inputTrianglesCopy[i].mMatrix);
				 tempCenter[0]+=inputTrianglesCopy[i].xd;
		tempCenter[1]+=inputTrianglesCopy[i].yd;
		toCenterCopy[i] = tempCenter;
		//console.log("To Center for "+i+":");
		//console.log(toCenterCopy[i]);
		
		
	
		//////console.log(tempCenter);
		
		//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		}
	}
	//var tempCenter = toCenterCopy[sHead];
	//////console.log("Center:"+tempCenter);
	}
	//}
	//gameCtr = 0;
	gameCtr++;
	snakeCtr--;
	//////console.log(inputTriangles);
}

// read triangles in, load them into webgl buffers
function loadTrianglesAndRender() {
	//console.log("Loading");
	
    //inputTriangles = getJSONFile(INPUT_TRIANGLES_URL,"triangles");
	inputTriangles = getTestData();;
	
	
	
	
	//inputTrianglesCopy = inputTriangles.slice(0);
	inputTrianglesCopy = [];
	for(var i=0; i<inputTriangles.length; i++){
		if(i == sindex){
			inputTriangles[i].xd = 0.5;
			inputTriangles[i].yd = 0;
			inputTriangles[i].type = "p";
			
		}
		else if(i == NPsindex){
			inputTriangles[i].xd = -0.5;
			inputTriangles[i].yd = 0;
			inputTriangles[i].type = "np";
		}
		else{
			inputTriangles[i].xd = 0;
			inputTriangles[i].yd = 0;
		}
		inputTrianglesCopy[i] = inputTriangles[i];
		var x=0, y=0, z=0;
		for (whichSetVert=0; whichSetVert<inputTriangles[i].vertices.length; whichSetVert++) {
			var vtxToAdd = inputTriangles[i].vertices[whichSetVert];
			
			x+=vtxToAdd[0];
			y+=vtxToAdd[1];
			z+=vtxToAdd[2];
			
		} // end for vertices in set
		x/=inputTriangles[i].vertices.length;
		y/=inputTriangles[i].vertices.length;
		z/=inputTriangles[i].vertices.length;
		if(toCenter[i] == undefined){
			toCenter[i] = [x,y,z];
		}
		
		
	}
	//console.log("Input")
	//console.log(inputTriangles);
	//console.log("Copy");
	//inputTrianglesCopy = inputTriangles.slice(0,inputTriangles.length);
	//console.log(inputTrianglesCopy);
	toCenterCopy = toCenter.slice();
	for(var i=0; i<inputTriangles.length; i++){
		if(inputTriangles[i].material.texture == "https://i.imgur.com/H1N2gBt.png")
			food = i;
	}
	getFood();
	lastNodeP = sindex;
	NPlastNodeP = NPsindex;
	//console.log("Last node");
	//console.log(inputTrianglesCopy[lastNodeP]);
	//console.log("To center:"+toCenterCopy[lastNodeP]);
	//inputLight = getJSONFile(LIGHTS_URL,"lights");
	inputLight = getLight();
	lightLoc.push(inputLight[0].x,inputLight[0].y,inputLight[0].z);
	//lightLoc = [-6, 0, 0];
	Ka = inputLight[0].ambient;
	Kd = inputLight[0].diffuse;
	Ks = inputLight[0].specular;
	
	//eyeLoc = [0.5,0.5,-0.5];
	eyeLoc = [0, -4.000000000000002, 0.4];
	
	lookAtV = eyeLoc.slice(0);
	lookAtV[2]+=1;
	lookAtV = [0, -4.000000000000002, 1.4000000000000001];
	newLook = [0, -3.4999999999999996, 1.2660254037844387];
	lookUp = [0,1,0];
	focusLen = lookAtV[2] - eyeLoc[2];
	
	
	// Perspective matrix
	pTransform = mat4.create();
	mat4.perspective(pTransform, 1.0, 1, 0.5, 25);
	vTransform = mat4.create();
	mat4.lookAt(vTransform, eyeLoc, newLook, lookUp);
	//lightLoc = [0.0,0.0,0.0];
	
	
	
    if (inputTriangles != String.null) { 
		for (var whichSet=0; whichSet<inputTriangles.length; whichSet++) {
			var zcent = 0;
			for (whichSetVert=0; whichSetVert<inputTriangles[whichSet].vertices.length; whichSetVert++) {
				var vtxToAdd = inputTriangles[whichSet].vertices[whichSetVert];
				zcent+=vtxToAdd[2];
			}
			zcent/=inputTriangles[whichSet].vertices.length;
			inputTriangles[whichSet].depth = zcent;
		}
		
		//////console.log(inputTriangles);
		
		depthSort();
		
		//////console.log(inputTriangles);
		
		//var url = "https://ncsucgclass.github.io/prog4/"+inputTriangles[0].material.texture;
		var url = inputTriangles[0].material.texture;
		
		//////console.log(url);
		//////console.log("alphaflag "+alphaflag);
		getTexture(url, 0);
    } // end if triangles found
} // end load triangles

// setup the webGL shaders
function setupShaders() {
    
    
    // define fragment shader in essl using es6 template strings
    var fShaderCode = `
        precision mediump float;

		uniform vec3 lightLoc;
		uniform vec3 eyeLoc;
		uniform vec3 ka;
		uniform vec3 kd;
		uniform vec3 ks;
		
		varying vec3 lighting;
		varying vec2 vUv;
		varying float lf;
		
		uniform sampler2D texSampler;
		
		uniform vec3 ambColor;
		uniform vec3 specColor;
        uniform vec3 triColor;
		uniform float specN;
		varying float a;
        void main(void) {
            //gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); // all fragments are white
            //gl_FragColor = vec4(lighting, 1.0);
			if(lf == 0.0)
				gl_FragColor = vec4(lighting, 1.0)*texture2D(texSampler, vUv);
				
			else if(lf == 1.0)
				gl_FragColor = vec4(lighting, a)*texture2D(texSampler, vUv);
			else
				gl_FragColor = texture2D(texSampler, vUv);
			
        }
    `;
    
    // define vertex shader in essl using es6 template strings
    var vShaderCode = `
        precision mediump float;
		
		uniform vec3 ambColor;
		uniform vec3 specColor;
        uniform vec3 triColor;
		uniform float specN, lightingFlag;
		uniform mat4 matModel;
		uniform mat4 pTransform;
		uniform mat4 vTransform;
		
        attribute vec3 vertexPosition;
		attribute vec3 normalPosition;
		attribute vec2 aVertexUv;
		
		uniform vec3 lightLoc;
		uniform vec3 eyeLoc;
		uniform vec3 ka;
		uniform vec3 kd;
		uniform vec3 ks;
		uniform float alpha;
		
		varying float a;		
		varying vec3 lighting;
		varying vec2 vUv;
		varying float lf;

        void main(void) {
            vec4 position = matModel * vec4(vertexPosition, 1.0); // use the untransformed position
			vec4 positiontemp = vTransform * position; // use the untransformed position
			gl_Position = pTransform * positiontemp;
			vec4 lightPos = vTransform * vec4(lightLoc, 1.0);		
			vec3 lightDir = normalize(lightLoc - vec3(position.x, position.y, position.z));
			float diffuseComponent = max(0.0, dot(normalize(normalPosition), lightDir));
			
			vec3 eyeDir = normalize(eyeLoc - position.xyz);			
			vec3 vecH = normalize((lightDir + eyeDir)/length(lightDir + eyeDir));
			float specularComponent = pow(clamp(dot(normalize(normalPosition), vecH), 0.0, 1.0), specN);
			//lighting = (kd * triColor * diffuseComponent) + (ks * specColor * specularComponent);
			lighting = (ka * ambColor) + (kd * triColor * diffuseComponent) + (ks * specColor * specularComponent);
			
			lf = lightingFlag;
			a = alpha;
			vUv = aVertexUv;
			
        }
    `;
    
    try {
        // //console.log("fragment shader: "+fShaderCode);
        var fShader = gl.createShader(gl.FRAGMENT_SHADER); // create frag shader
        gl.shaderSource(fShader,fShaderCode); // attach code to shader
        gl.compileShader(fShader); // compile the code for gpu execution

        // //console.log("vertex shader: "+vShaderCode);
        var vShader = gl.createShader(gl.VERTEX_SHADER); // create vertex shader
        gl.shaderSource(vShader,vShaderCode); // attach code to shader
        gl.compileShader(vShader); // compile the code for gpu execution
            
        if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) { // bad frag shader compile
            throw "error during fragment shader compile: " + gl.getShaderInfoLog(fShader);  
            gl.deleteShader(fShader);
        } else if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) { // bad vertex shader compile
            throw "error during vertex shader compile: " + gl.getShaderInfoLog(vShader);  
            gl.deleteShader(vShader);
        } else { // no compile errors
            shaderProgram = gl.createProgram(); // create the single shader program
            gl.attachShader(shaderProgram, fShader); // put frag shader in program
            gl.attachShader(shaderProgram, vShader); // put vertex shader in program
            gl.linkProgram(shaderProgram); // link program into gl context

            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) { // bad program link
                throw "error during shader program linking: " + gl.getProgramInfoLog(shaderProgram);
            } else { // no shader program link errors
                gl.useProgram(shaderProgram); // activate shader program (frag and vert)
				getAllLocs();
                gl.enableVertexAttribArray(GLSLLocs.attributeLocations.vertexPositionAttrib); // input to shader from array
				gl.enableVertexAttribArray(GLSLLocs.attributeLocations.normalPositionAttrib);
				gl.enableVertexAttribArray(GLSLLocs.attributeLocations.uvAttrib);
				
				gl.uniform3fv(GLSLLocs.uniformLocations.triColorLoc, color);
				gl.uniform3fv(GLSLLocs.uniformLocations.ambColorLoc, ambColor);
				gl.uniform3fv(GLSLLocs.uniformLocations.specColorLoc, specColor);
				gl.uniform1f(GLSLLocs.uniformLocations.specNLoc, specN);
				gl.uniform1f(GLSLLocs.uniformLocations.alphaLoc, alpha);
				
				gl.uniform1f(GLSLLocs.uniformLocations.lightingFlagLoc, lightingFlag);
				gl.uniform3fv(GLSLLocs.uniformLocations.kaLoc, Ka);
				gl.uniform3fv(GLSLLocs.uniformLocations.kdLoc, Kd);
				gl.uniform3fv(GLSLLocs.uniformLocations.ksLoc, Ks);	

				gl.uniform3fv(GLSLLocs.uniformLocations.lightPosLoc, lightLoc);
				gl.uniform3fv(GLSLLocs.uniformLocations.eyePosLoc, eyeLoc);				
				
				
            } // end if no shader program link errors
        } // end if no compile errors
    } // end try 
    
    catch(e) {
        //console.log(e);
    } // end catch
} // end setup shaders



// render the loaded model
function renderTriangles(i) {
	
    //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // clear frame/depth buffers
    //requestAnimationFrame(renderTriangles);
	if(inputTriangles[i].type != ""){
    
		gl.uniformMatrix4fv(GLSLLocs.uniformLocations.pTransformLoc, false, pTransform);
		gl.uniformMatrix4fv(GLSLLocs.uniformLocations.vTransformLoc, false, vTransform);
		gl.uniformMatrix4fv(GLSLLocs.uniformLocations.modelMatLoc, false, inputTriangles[i].mMatrix);
		//////console.log(inputTriangles[i].mMatrix);
		
		

		
		// vertex buffer: activate and feed into vertex shader
		gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer[i]); // activate
		gl.vertexAttribPointer(GLSLLocs.attributeLocations.vertexPositionAttrib,3,gl.FLOAT,false,0,0); // feed
		
		gl.bindBuffer(gl.ARRAY_BUFFER,normalBuffer[i]);
		gl.vertexAttribPointer(GLSLLocs.attributeLocations.normalPositionAttrib,3,gl.FLOAT,false,0,0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER,uvBuffer[i]);
		gl.vertexAttribPointer(GLSLLocs.attributeLocations.uvAttrib,2,gl.FLOAT,false,0,0);
		
		
		gl.activeTexture(gl.TEXTURE0);
		/*if(i >= sindex)
			gl.bindTexture(gl.TEXTURE_2D, snakeTex);
		else*/	
			gl.bindTexture(gl.TEXTURE_2D, triTex[i]);
		gl.uniform1i(GLSLLocs.uniformLocations.texSamplerLoc, 0);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		
		// triangle buffer: activate and render
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,triangleBuffer[i]); // activate
		gl.drawElements(gl.TRIANGLES,triBufferSize[i],gl.UNSIGNED_SHORT,0); // render
	}
} // end render triangles



function keyActionListener(event){
	event = event || window.event;
	var key  = event.key || event.keyCode || event.which;
	//console.log(key);
	try{
		keyActionFunctions[key].call();
	}
	catch(e){
		//console.log(e);
		//////console.log("Nothing mapped to key "+key);
	}
}


/* MAIN -- HERE is where execution begins after window load */

function main() {
  // Add event listener for keypresses
  window.addEventListener('keydown', keyActionListener, false);
  
  // Get on with WebGL stuff
  setupWebGL(); // set up the webGL environment
  gl.clearColor(0,0,0,0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  alphaflag = true;
  initgrid();
  snakeCtr = Math.floor(Math.random()*6 + 1);
  //console.log(grid);
  loadTrianglesAndRender(); // load in the triangles from tri file, and load shader and render accordingly
  
  
} // end main
