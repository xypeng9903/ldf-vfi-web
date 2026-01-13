document.addEventListener('DOMContentLoaded', () => {
    const mainContainers = document.querySelectorAll('.videocomparison-container');

    mainContainers.forEach(container => {
        const mainImages = container.querySelectorAll('.videocomparison-images img');
        const thumbnails = container.querySelectorAll('.thumbnail');
        const leftArrow = container.querySelector('.left-arrow');
        const rightArrow = container.querySelector('.right-arrow');

        const imagePathElement = container.querySelector('.videocomparison-info');
        const basePath = imagePathElement.dataset.path + "/"; // Note the trailing slash

        let currentIndex = 0; // Start with the first thumbnail selected

        function updateMainImages(index, isInitial = false) {
            const video = container.querySelector('.demo-video');
            const imagesWrapper = container.querySelector('.videocomparison-images');
            const thumbnail = thumbnails[index];

            // Lock height to prevent collapse during transition
            if (video.offsetHeight > 0) {
                imagesWrapper.style.height = `${video.offsetHeight}px`;
            }

            video.classList.add('fade-out');

            setTimeout(() => {
                // Update video source based on selected thumbnail and method
                if (thumbnail.dataset.video) {
                    video.src = `${basePath}${thumbnail.dataset.video}`;
                } else {
                    video.src = `${basePath}00${index}_result.mp4`; 
                }

                // Play the video from the beginning
                video.currentTime = 0;
                video.loop = true;
                video.preload = "auto";
                video.autoplay = false;
                
                imagesWrapper.style.height = 'auto';
                video.classList.remove('fade-out');
            }, 200);
        }


        function updateThumbnails() {
            thumbnails.forEach((thumbnail, index) => {
                thumbnail.classList.remove('selected');
            });

            thumbnails[currentIndex].classList.add('selected');
            
            const thumbBar = container.querySelector('.thumbnails');
            const wrapper = container.querySelector('.thumbnails-wrapper');
            
            // Get dimensions dynamically
            const wrapperWidth = wrapper.offsetWidth;
            const thumb = thumbnails[currentIndex];
            const thumbWidth = thumb.offsetWidth;
            
            // Calculate position relative to the container
            // We useoffsetLeft if thumbBar is the offsetParent, which usually is true if it's positioned
            // But to be safe with transforms, we can just sum up widths if we assume strict order
            // Or better, let's just rely on the fixed width if we are sure, OR:
            
            // Since .thumbnails has a transform, getBoundingClientRect might be affected by current animation state?
            // Actually offsetLeft is based on layout, transform doesn't affect offsetLeft of children usually.
            
            const thumbCenter = thumb.offsetLeft + thumbWidth / 2;
            const wrapperCenter = wrapperWidth / 2;
            
            const offset = wrapperCenter - thumbCenter;
            
            thumbBar.style.transform = `translateX(${offset}px)`;
        }

        if (leftArrow) {
            leftArrow.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
                updateMainImages(currentIndex);
                updateThumbnails();
            });
        }

        if (rightArrow) {
            rightArrow.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % thumbnails.length;
                updateMainImages(currentIndex);
                updateThumbnails();
            });
        }

        thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => {
                currentIndex = index;
                updateMainImages(currentIndex);
                updateThumbnails();
            });
        });

        // Initialize
        updateMainImages(currentIndex, true);
        updateThumbnails();
    });
});
