Requirements

- Draw a cube with edge lengths 2 and with its center at the origin of theworld space. The faces of the cube should be colored in different colors.(You can select the colors yourself.) "YES"

- Draw two tracks as circles with their radii 10 units. 

  § One track (white circle in the video) denotes the “equator” and the camera moves along the equator as its longitude changes. "YES"

  § The other track (yellow circle in the video) denotes the path alongwhich the camera moves as its latitude changes. Note that this track should be transformed as the longitude changes."YES"

 - To show the camera location, draw the “line of sight”(the pink line in the video.) from the camera position to the origin. The distance to the camera from the origin should be 10 units. "NO"

 - On the left half of the canvas, draw the whole scene (the cube, the camera tracks, and the line-of-sight) seen from the fixed camera. (You do not need to draw the axes.) "YES"

  § The camera can be either orthographic or perspective. "PERSPECTIVE"
  § Just make it sure that the whole seen can be seen. "YES"
  § You can use setLookAt()/lookAt() of glMatrix library for this viewing transformation "YES"

 - On the right half of the canvas, draw the scene viewed from the moving camera.

  § You should use a perspective camera. "YES"
  § Set the parameters properly so that the whole cube can be drawn. "YES"
  § The distance from the camera to the origin should be 10 units. "YES"
  § When longitude=latitude=0, the camera should be (in world coordinates)
   • located at (0, 0, 10) "YES"
   • looking long the direction (0,0,-1) "YES"
   • with it “up direction” (0,1,0). "YES"
  § You should NOT use setLootAt()/lookAt() function for this viewing transformation.
  "NO"

 - The moving camera should be controlled by the arrow keys and the slide bars. (The range of the longitude is [0,360] and that of the latitude is [-90,90].)
  § Left/Right: Decrese/increse the longitude by 1 degree. "YES"
  § Down/Up: Decrese/increse the latitude by 1 degree. When the camera is moved by the arrow keys, the slide bars should be changed accordingly. "YES"