(function () {

    const components = {
        stopwatch: document.querySelector("#stopwatch #time"),
        buttons: {
            toggle: document.querySelector("#stopwatch #toggle"),
            restart: document.querySelector("#stopwatch #restart"),
            flag: document.querySelector("#stopwatch #flag"),
        },
        flagslist: document.querySelector("#stopwatch #flags-list ol")
    }
    
    let centiseconds = 0;
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    
    let interval;
    
    /**
     * @param { { centiseconds: number, seconds: number, minutes: number, hours: number } | undefined } data
    */
    function getTimeString(data) {
        if (data) {
            return [
                data.hours.toString().padStart(2, "0"),
                data.minutes.toString().padStart(2, "0"),
                data.seconds.toString().padStart(2, "0"),
                data.centiseconds.toString().padStart(2, "0")
            ].join(":");
        }
        return [
            hours.toString().padStart(2, "0"),
            minutes.toString().padStart(2, "0"),
            seconds.toString().padStart(2, "0"),
            centiseconds.toString().padStart(2, "0")
        ].join(":");
    }
    
    /**
     * @param { { centiseconds: number, seconds: number, minutes: number, hours: number } } data 
    */
    function getCentiseconds(data) {
        return (data.centiseconds) +
        (data.seconds * 100) +
        (data.minutes * 60 * 100) +
        (data.hours * 60 * 60 * 100);
    }
    
    /**
     * @returns { { centiseconds: number, seconds: number, minutes: number, hours: number } } 
    */
    function parseCentiseconds(value = 0) {
        const hours = Math.floor(value / (100 * 60 * 60))
        const minutes = Math.floor((value - (hours * 60 * 60 * 100)) / (100 * 60))
        const seconds = Math.floor((value - (hours * 60 * 60 * 100) - (minutes * 60 * 100)) / 100);
        const centiseconds = Math.floor(value - (hours * 60 * 60 * 100) - (minutes * 60 * 100) - (seconds * 100))
        return { centiseconds, seconds, minutes, hours };
    }
    
    function update() {
    
        centiseconds++;
        if (centiseconds === 100) {
            centiseconds = 0;
            seconds++;
        }
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }
        if (minutes === 60) {
            minutes = 0;
            hours++;
        }
    
        components.stopwatch.textContent = getTimeString();
    
    }
    
    function start() {
        interval = setInterval(update, 10);
        components.buttons.restart.disabled = true;
        components.buttons.flag.disabled = false;
    }
    
    function pause() {
        clearInterval(interval);
        interval = null;
        components.buttons.restart.disabled = false;
        components.buttons.flag.disabled = false;
    }
    
    function restart() {
    
        centiseconds = -1;
        seconds = 0;
        minutes = 0;
        hours = 0;
        lastFlagData = null;
    
        components.buttons.restart.disabled = true;
        components.buttons.flag.disabled = true;
    
        components.flagslist.innerHTML = "";
        showFlagsPlaceholder();
        update();
    
    }
    
    /**
     * @type { { centiseconds: number, seconds: number, minutes: number, hours: number } | null }
    */
    let lastFlagData = null;
    
    /**
     * @param { { centiseconds: number, seconds: number, minutes: number, hours: number } } data 
     * @returns { { centiseconds: number, seconds: number, minutes: number, hours: number } }
    */
    function getDifferenceForFlag(data) {
    
        if (!lastFlagData) {
            lastFlagData = data;
            return data;
        }
        
        const resting = getCentiseconds(data) - getCentiseconds(lastFlagData);
        lastFlagData = data;
        return parseCentiseconds(resting);
        
    }
    
    function flag() {
    
        document.querySelector("#stopwatch #flags-list #placeholder")?.remove();
        const time = getTimeString();
        if (components.flagslist.textContent.includes(time)) return;
        
        const li = document.createElement("li");
        li.innerHTML =
        `<span id="detail">${
            (document.getElementsByClassName("flag").length + 1)
        }.</span> ${time} <span id="detail">(${
            getTimeString(getDifferenceForFlag({ centiseconds, seconds, minutes, hours }))
        })</span>`;
        li.className = "flag";
    
        components.flagslist.appendChild(li);
        components.flagslist.scrollTo({
            top: components.flagslist.scrollHeight
        });
        li.addEventListener("dblclick", function () {
            li.remove();
            showFlagsPlaceholder();
        })
    
    }
    
    function showFlagsPlaceholder() {
        if (document.getElementsByClassName("flag").length) return;
        const div = document.createElement("div");
        div.textContent = "Flags will appear here. Double click to delete them.";
        div.id = "placeholder";
        components.flagslist.appendChild(div);
    }
    
    function main() {
        components.buttons.toggle.addEventListener("click", function () {
            if (interval) {
                components.buttons.toggle.textContent = "Start";
                return pause();
            }
            components.buttons.toggle.textContent = "Pause";
            start();
        });
        components.buttons.restart.addEventListener("click", restart);
        components.buttons.flag.addEventListener("click", flag);
    }
    
    document.addEventListener("DOMContentLoaded", main());

})();