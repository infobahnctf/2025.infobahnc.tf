

(() => {
    let mql = window.matchMedia("(width <= 700px)");
    const img = document.getElementById('pixelCar');
    const overlay = document.querySelector('.overlay-text');
    const sponsor = document.querySelector('.sponsor-text-worker');

    // Set the image src
    if (!mql.matches) {
        img.src = '/themes/custom-theme/static/img/PixelCar.png';
    }


    // Wait for the image to fully load
    img.addEventListener('load', () => {
        // Position overlay initially
        updateOverlay();

        // Reposition overlay on resize
        window.addEventListener('resize', updateOverlay);
    });

    function updateOverlay() {
        if (!mql.matches) {
            const rect = img.getBoundingClientRect();
            overlay.style.top = rect.top + img.height * 89.25 / 100 + 'px';
            overlay.style.left = rect.left + img.width * 66.7 / 100 + 'px';
            overlay.style.width = img.width * 15.265625 / 100 + 'px';
            overlay.style.height = img.height * 9.38888888889 / 100 + 'px';

            sponsor.style.top = rect.top + img.height * 75.1944444444 / 100 + 'px';
            sponsor.style.left = rect.left + img.width * 54.8125 / 100 + 'px';
            sponsor.style.width = img.width * 41.984375 / 100 + 'px';
            sponsor.style.height = img.height * 5.5 / 100 + 'px';

            document.getElementById('sponsor-msg').style.display = 'block';
             document.getElementById('footer').style.display = 'none';

        }else {
            document.getElementById('sponsor-msg').style.display = 'none';
            document.getElementById('footer').style.display = 'block';
        }
        //document.getElementById('text1').style.top = (document.getElementById('pixelCar').height * 89.25/100) + 'px';
        //document.getElementById('text1').style.left = (document.getElementById('pixelCar').width * 66.7/100) + 'px';
    };

    const countdownEl = document.getElementById("ctf-end");
    countdownEl.style.display = 'block';

    // Read the end timestamp from the span and convert to milliseconds
    const endTimestamp = parseInt(countdownEl.textContent) * 1000;

    function updateCountdown() {
        function addxHours(tsSeconds,x) {
            return tsSeconds * 1000 + (x * 60 * 60 * 1000);
        }
        const now = Date.now();
        const startdiff = window.init.start * 1000 - now;
        const wave1diff = addxHours(window.init.start,12) - now;
        const wave2diff = addxHours(window.init.start,24) - now;
        var diff = window.init.end * 1000 - now;


        if (diff <= 0) {
            countdownEl.textContent = "Destination arrived";
            clearInterval(timerInterval);
            return;
        }
        
        if (startdiff > 0) {
            diff = startdiff
            label = "Departing in"
        }
        else if (wave1diff > 0){
            diff = wave1diff
            label = "Stop 1 in"
        }
        else if (wave2diff > 0){
            diff = wave2diff
            label = "Stop 2 in"
        }
        else{
            label = "Arriving in"
        }

        // Calculate days, hours, minutes, seconds
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const daysStr = String(days).padStart(2, "0");
        const hoursStr = String(hours).padStart(2, "0");
        const minutesStr = String(minutes).padStart(2, "0");
        const secondsStr = String(seconds).padStart(2, "0");

        countdownEl.textContent = `${label}\n${daysStr}:${hoursStr}:${minutesStr}:${secondsStr}`;

    }



    // Update every second
    const timerInterval = setInterval(updateCountdown, 1000);

    window.addEventListener("resize", () => {
        let mql = window.matchMedia("(width <= 700px)");
        if (!mql.matches) {
            img.src = '/themes/custom-theme/static/img/PixelCar.png';
        }
        else {
            img.src = '/themes/custom-theme/static/img/transparentBg.png';
        }
    });

    window.addEventListener("load", () => {
        // Initial call
        updateCountdown();
    })

})();
