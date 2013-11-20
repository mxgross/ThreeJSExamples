
$(document).ready(function () {
    var mouseX, mouseY;
    var targetList = [];
    var projector = new THREE.Projector();
    var intersects;

    $("canvas").dblclick(function(event){

        event.preventDefault();

        var vector = new THREE.Vector3(  (event.clientX / window.innerWidth ), - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
        projector.unprojectVector( vector, camera );

        var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

        targetList.push(floor);

        // create an array containing all objects in the scene with which the ray intersects
        var intersects = ray.intersectObjects( targetList );

        // if there is one (or more) intersections
        if ( intersects.length > 0 )
        {
            console.log(intersects[0].point.x + ' ' + intersects[0].point.y + ' ' + intersects[0].point.z);

            var newPinwheel = pinwheel.clone();
            newPinwheel.position = intersects[0].point;
            scene.add(newPinwheel);
        }

    })


});