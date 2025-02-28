const timetable = {
    Monday: [
        { subject: "Math", start: "8:40 AM", end: "9:30 AM" },
        { subject: "English", start: "9:30 AM", end: "10:10 AM" },
        { subject: "Advocate", start: "10:10 AM", end: "10:50 AM" },
        { subject: "Recess", start: "10:50 AM", end: "11:10 AM" },
        { subject: "Digital Tech", start: "11:10 AM", end: "12:50 PM" },
        { subject: "Lunch", start: "12:50 PM", end: "1:35 PM" },
        { subject: "Media Studies", start: "1:35 PM", end: "2:25 PM" },
        { subject: "Sport and Rec", start: "2:25 PM", end: "3:15 PM" }
    ],
    Tuesday: [
        { subject: "Sport and Rec", start: "8:40 AM", end: "9:30 AM" },
        { subject: "Media Studies", start: "9:30 AM", end: "10:10 AM" },
        { subject: "Digital Tech", start: "10:10 AM", end: "10:50 AM" },
        { subject: "Recess", start: "10:50 AM", end: "11:10 AM" },
        { subject: "Maths", start: "11:10 AM", end: "12:50 PM" },
        { subject: "Lunch", start: "12:50 PM", end: "1:35 PM" },
        { subject: "English", start: "1:35 PM", end: "2:25 PM" },
        { subject: "Electronics", start: "2:25 PM", end: "3:15 PM" }
    ],
    Wednesday: [
        { subject: "Electronics", start: "8:50 AM", end: "10:10 AM" },
        { subject: "Advocate", start: "10:10 AM", end: "10:50 AM" },
        { subject: "Recess", start: "10:50 AM", end: "11:10 AM" },
        { subject: "Media Studies", start: "11:10 AM", end: "12:50 PM" },
    ],
    Thursday: [
        { subject: "English", start: "8:40 AM", end: "9:30 AM" },
        { subject: "Electronics", start: "9:30 AM", end: "10:10 AM" },
        { subject: "Maths", start: "10:10 AM", end: "10:50 AM" },
        { subject: "Recess", start: "10:50 AM", end: "11:10 AM" },
        { subject: "Sport and Rec", start: "11:10 AM", end: "12:50 PM" },
        { subject: "Lunch", start: "12:50 PM", end: "1:35 PM" },
        { subject: "Media Studies", start: "1:35 PM", end: "2:25 PM" },
        { subject: "Digital Tech", start: "2:25 PM", end: "3:15 PM" }
    ],
    Friday: [
        { subject: "Digital Tech", start: "8:40 AM", end: "9:30 AM" },
        { subject: "Sport and Rec", start: "9:30 AM", end: "10:10 AM" },
        { subject: "Advocate", start: "10:10 AM", end: "10:50 AM" },
        { subject: "Recess", start: "10:50 AM", end: "11:10 AM" },
        { subject: "English", start: "11:10 AM", end: "12:50 PM" },
        { subject: "Lunch", start: "12:50 PM", end: "1:35 PM" },
        { subject: "Electronics", start: "1:35 PM", end: "2:25 PM" },
        { subject: "Maths", start: "2:25 PM", end: "3:15 PM" }
    ]
};

function getCurrentTime() {
    const now = new Date();
    return {
        day: now.toLocaleDateString("en-US", { weekday: "long" }),
        hours: now.getHours(),
        minutes: now.getMinutes(),
    };
}

function convertTo24Hour(timeStr) {
    let [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return { hours, minutes };
}

function findCurrentAndNextClass() {
    const { day } = getCurrentTime();

    if (day === "Saturday" || day === "Sunday") {
        document.getElementById("current-subject").innerText = "No school today!";
        document.getElementById("next-subject").innerText = "";
        document.getElementById("countdown").innerText = "";
        document.getElementById("progress-bar").style.width = "0";
        document.getElementById("progress-text").innerText = "0%";
        return;
    }

    const todayClasses = timetable[day] || [];
    const { hours, minutes } = getCurrentTime();

    let currentClass = "No class right now, lucky!";
    let nextClass = null;

    for (let i = 0; i < todayClasses.length; i++) {
        let { subject, start, end } = todayClasses[i];
        let { hours: startH, minutes: startM } = convertTo24Hour(start);
        let { hours: endH, minutes: endM } = convertTo24Hour(end);

        if (hours >= startH && (hours < endH || (hours === endH && minutes < endM))) {
            currentClass = subject;
            nextClass = todayClasses[i + 1] || null;
            break;
        }
    }

    document.getElementById("current-subject").innerText = currentClass;
    document.getElementById("next-subject").innerText = nextClass ? nextClass.subject : "No more classes today";

    if (nextClass) {
        startCountdown(nextClass.start);
    } else {
        document.getElementById("countdown").innerText = "No more classes today";
        document.getElementById("progress-bar").style.width = "0";
        document.getElementById("progress-text").innerText = "0%";
    }
}

function startCountdown(startTime) {
    const countdownElement = document.getElementById("countdown");
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");

    function updateCountdown() {
        const now = new Date();
        const { hours: startH, minutes: startM } = convertTo24Hour(startTime);
        const startTimeMs = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startH, startM, 0).getTime();
        const timeDiff = startTimeMs - now.getTime();

        if (timeDiff > 0) {
            const minutes = Math.floor(timeDiff / 60000);
            const seconds = Math.floor((timeDiff % 60000) / 1000);
            countdownElement.innerText = `${minutes}m ${seconds}s`;

            const { day } = getCurrentTime();
            const todayClasses = timetable[day] || [];
            let totalDuration = 0;

            for (let i = 0; i < todayClasses.length; i++) {
                let { start, end } = todayClasses[i];
                let { hours: startH, minutes: startM } = convertTo24Hour(start);
                let { hours: endH, minutes: endM } = convertTo24Hour(end);
                const classStartMs = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startH, startM, 0).getTime();
                const classEndMs = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endH, endM, 0).getTime();

                if (now.getTime() >= classStartMs && now.getTime() < classEndMs) {
                    totalDuration = classEndMs - classStartMs;
                    break;
                }
            }

            const progress = ((totalDuration - timeDiff) / totalDuration) * 100;
            progressBar.style.width = `${progress}%`;
            progressText.innerText = `${Math.round(progress)}%`;

            if (timeDiff <= 30000) {
                countdownElement.classList.add("blink");
            } else {
                countdownElement.classList.remove("blink");
            }
        } else {
            countdownElement.innerText = "Starting now!";
            progressBar.style.width = "100%";
            progressText.innerText = "100%";
            findCurrentAndNextClass();
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

document.addEventListener("DOMContentLoaded", function() {
    const themeToggle = document.createElement("button");
    themeToggle.innerText = "Switch Theme";
    themeToggle.style.position = "absolute";
    themeToggle.style.top = "20px";
    themeToggle.style.right = "20px";
    themeToggle.style.padding = "10px 20px";
    themeToggle.style.border = "none";
    themeToggle.style.borderRadius = "5px";
    themeToggle.style.cursor = "pointer";
    themeToggle.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    themeToggle.style.color = "white";
    themeToggle.style.fontSize = "16px";
    document.body.appendChild(themeToggle);

    const themes = ["light-theme", "dark-theme", "vibrant-theme", "pastel-theme", "monochrome-theme", "retro-theme", "nature-theme"];
    let currentThemeIndex = 0;

    const savedTheme = localStorage.getItem("selectedTheme");
    if (savedTheme) {
        currentThemeIndex = themes.indexOf(savedTheme);
        document.body.classList.add(savedTheme);
    } else {
        document.body.classList.add(themes[currentThemeIndex]);
    }

    themeToggle.addEventListener("click", function() {
        document.body.classList.remove(themes[currentThemeIndex]);
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        document.body.classList.add(themes[currentThemeIndex]);
        localStorage.setItem("selectedTheme", themes[currentThemeIndex]);
    });
});

findCurrentAndNextClass();
setInterval(findCurrentAndNextClass, 60000);