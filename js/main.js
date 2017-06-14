document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('iframe').addEventListener('load', function() {
        bubblesAPI.setFrameWindowParameters();
    });

    document.getElementById('Zoom-In').addEventListener('click', function() {
        bubblesAPI.setZoomAttributes('in');
    });

    document.getElementById('Zoom-Out').addEventListener('click', function() {
        bubblesAPI.setZoomAttributes('out');
    });

    document.getElementById('generate').addEventListener('click', bubblesAPI.generateBubbleArea);
});
