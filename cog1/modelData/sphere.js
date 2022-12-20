/**
 * Creates a unit sphere by subdividing a unit octahedron.
 * Starts with a unit octahedron and subdivides the faces,
 * projecting the resulting points onto the surface of a unit sphere.
 *
 * For the algorithm see:
 * https://sites.google.com/site/dlampetest/python/triangulating-a-sphere-recursively
 * http://sol.gfxile.net/sphere/index.html
 * http://nipy.sourceforge.net/dipy/reference/dipy.core.triangle_subdivide.html
 * http://skyview.gsfc.nasa.gov/blog/index.php/2008/12/31/skyview-to-include-healpix-and-wmap/
 *
 *        1
 *       /\
 *      /  \
 *    b/____\ c
 *    /\    /\
 *   /  \  /  \
 *  /____\/____\
 * 0      a     2
 *
 * Parameter:
 * 	recursionDepth
 * 	color or -1 = many colors
 *
 * For texture see:
 * http://earthobservatory.nasa.gov/Features/BlueMarble/
 *
 * @namespace cog1.data
 * @module sphere
 */

define(["exports", "data", "glMatrix"], function(exports, data) {
	"use strict";

	/**
	 * Procedural calculation.
	 *
	 * @parameter object with fields:
	 * @parameter scale
	 * @parameter recursionDepth
	 * @parameter color [-1 for many colors]
	 */
	exports.create = function(parameter) {

		if(parameter) {
			var scale = parameter.scale;
			var recursionDepth = parameter.recursionDepth;
			var color = parameter.color;
			var textureURL = parameter.textureURL;
		}
		// Set default values if parameter is undefined.
		if(scale == undefined) {
			scale = 250;
		}
		if(recursionDepth == undefined) {
			recursionDepth = 3;
		}
		if(color == undefined) {
			color = 9;
		}
		if(textureURL == undefined) {
			textureURL = "";
		}

		// Instance of the model to be returned.
		var instance = {};

		// BEGIN exercise Sphere

		// Starting with octahedron vertices
		instance.vertices = [  [0, 0, 0],
			[-1, 0, 0],
			[+1, 0, 0],
			[0, -1, 0],
			[0, +1, 0],
			[0, 0, -1],
			[0, 0, +1]
		];
		instance.polygonVertices = [  [1, 6, 4],
			[3, 6, 1],
			[6, 3, 2],
			[6, 2, 4],
			[4, 2, 5],
			[5, 1, 4],
			[3, 5, 2],
			[3, 1, 5]
		];
		instance.polygonColors = [0, 1, 2, 7, 3, 4, 5, 6, 0, 7];
		// octahedron triangles

		// devide_all.call(instance, recursionDepth);

		// END exercise Sphere

		devide_all.call(instance, recursionDepth);

		generateTextureCoordinates.call(instance);

		data.applyScale.call(instance, scale);
		data.setColorForAllPolygons.call(instance, color);

		instance.textureURL = textureURL;

		return instance;
	}
	/**
	 * Called with this pointer set to instance.
	 * Generate texture coordinates one per each corner of a polygon,
	 * thus a vertex can have more than one uv, depending on the polygon it is part of.
	 * The coordinates u.v represent the angles theta and phi
	 * of point vector to x and y axis.
	 * See:
	 * http://tpreclik.dyndns.org/codeblog/?p=9
	 *
	 * Assume that vertices are not yet scaled, thus have length 1.
	 *
	 */
	function generateTextureCoordinates() {

		// BEGIN exercise Sphere-Earth-Texture

		// As there is not exactly one texture coordinate per vertex,
		// we have to install a different mapping as used for polygonVertices to vertices.
		// For texture coordinate system use openGL standard, where origin is bottom-left.
		this.textureCoord = [];
		this.polygonTextureCoord = [];


		// Loop over vertices/edges in polygon.

		// Shorthands for the current vertex.


		// Calculate longitude (east-west position) phi (u-coordinate).
		// arctangent (of here z/x), representing the angle theta between the positive X axis, and the point.
		// Scale phi to uv range [0,1].


		// Calculate latitude (north-south position) theta (v-coordinate) from y component of vertex.
		// Scale theta to uv range [0,1].


		// Store new uv coordinate in new uv-vector.
		//console.log("phi:" + (~~(phi * 100)) + "  theta:" + (~~(theta * 100)) + " x:" + (~~(x * 100)) + " z:" + (~~(z * 100)));


		// Problem with phi/u: phi=360 and phi=0 are the same point in 3D and also on a tiled texture.
		// But for faces it is a difference if uv-range is 350�-360� [.9-1]or 350�-0� [.9-0].
		// Thus, insert a check/hack (assuming faces cover only a small part of the texture):

		// Check if u-range should be low or high (left or right in texture),
		// by summing up u values (ignoring u=0 values).

		// Check and correct u values if 0;

		// END exercise Sphere-Earth-Texture
	}

	// BEGIN exercise Sphere

	/**
	 * Recursively divide all triangles.
	 */
	function devide_all(recursionDepth, nbRecusions) {
		// nbRecusions is not set from initial call.
		if(nbRecusions == undefined) {
			nbRecusions = 0;
		}
		// Stop criterion.
		if (nbRecusions == recursionDepth){
			return;
		}
		//console.log("nbRecusions: "+nbRecusions);
		// Assemble divided polygons in an new array.
		var sphereVertices = [];
		// Indices of the last three new vertices.


		// Calculate new vertex in the middle of edge.
		for (let polygonIndex = 0; polygonIndex < this.polygonVertices.length; polygonIndex++) {
			const newVertexIndices = [];

			for (let vertexIndex = 0; vertexIndex < 3; vertexIndex++) {
				const currentVertex = this.vertices[this.polygonVertices[polygonIndex][vertexIndex]];
				let nextVertex = this.vertices[this.polygonVertices[polygonIndex][vertexIndex + 1]];
				if (vertexIndex === 2) {
					nextVertex = this.vertices[this.polygonVertices[polygonIndex][0]];
				}
				const x = (currentVertex[0] + nextVertex[0]) / 2;
				const y = (currentVertex[1] + nextVertex[1]) / 2;
				const z = (currentVertex[2] + nextVertex[2]) / 2;

				const newVertex = [x * (1 / Math.sqrt(x ** 2 + y ** 2 + z ** 2)), y * (1 / Math.sqrt(x ** 2 + y ** 2 + z ** 2)), z * (1 / Math.sqrt(x ** 2 + y ** 2 + z ** 2))];
				this.vertices.push(newVertex);

				const newIndex = this.vertices.length - 1;
				newVertexIndices.push(newIndex);
			}

			sphereVertices.push(
				[newVertexIndices[0], newVertexIndices[1], newVertexIndices[2]],
				[this.polygonVertices[polygonIndex][0], newVertexIndices[0], newVertexIndices[2]],
				[this.polygonVertices[polygonIndex][1], newVertexIndices[1], newVertexIndices[0]],
				[this.polygonVertices[polygonIndex][2], newVertexIndices[2], newVertexIndices[1]]
			);
		}
		// Check if the new vertex exists already.
		// This happens because edges always belong to two triangles.

		// Remember index of new vertex.

		// console.log("Calculate new vertex "+v+"->"+newIndex[v]+" : "+vertices[p[v]]+" + "+ vertices[p[next]]+" = "+ newVertex);

		// Use the existing vertex for the new polygon.

		//console.log("New vertex exists "+v+"->"+newIndex[v]+" : "+this.vertices[p[v]]+" + "+ this.vertices[p[next]]+" = "+ newVertex);

		// Assemble new polygons.
		// Assure mathematical positive order to keep normals pointing outwards.
		// Triangle in the center.
		// Triangle in the corners.

		//console.log("Assemble new polygons "+v+" : "+p[v]+" , "+ newIndex[nextButOne]+" , "+ newIndex[v]);

		// Swap result.
		this.polygonVertices = sphereVertices;
		// Recursion.
		devide_all.call(this, recursionDepth, nbRecusions+1);
	}

	// END exercise Sphere

});