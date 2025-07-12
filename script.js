let currentSong = new Audio();

//Function that convert seconds into minutes:seconds format(00:12)
function secondsToMinutes(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    const formattedMins = String(mins).padStart(2, '0');
    const formattedSecs = String(secs).padStart(2, '0');

    return `${formattedMins}:${formattedSecs}`;
}



//Function that fetch all songs from the folder(/songs/)
async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = [];

    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}

//Function that play music when clicked
const playMusic = (musicName, pause = false) => {
    // let pm = new Audio("/songs/" + musicName)
    // console.log(musicName);

    currentSong.src = "/songs/" + musicName;
    if (!pause) {
        playSong.src = "pause.svg"
        currentSong.play();
    }
    document.querySelector(".s-info").innerHTML = decodeURI(musicName);
    document.querySelector(".s-time").innerHTML = "00:00 / 00:00"
}

async function main() {


    //get all songs
    let songs = await getSongs()
    playMusic(songs[0], pause = true)
    // console.log(songs);

    //Create list on left side and display all songs lists(li)
    let songul = document.querySelector(".song-list").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `
            <li>
                <img width="45px" src="music.svg" alt="" />
                <div class="song-info">
                  <div>${song.replaceAll("%20", " ")}</div>
                  <div>Song Artist</div>
                </div>
                <div class="song-playnow">
                  <span>Play Now</span>
                  <img width="15px" src="play.svg" alt="" />
                </div>
            </li>`;
    }

    // play the first song
    // var fsong = new Audio(songs[6])
    // document.getElementById('playButton').addEventListener('click', () => {
    //     fsong.play();
    // });

    //Add eventlistener to all songs. when clicked then play it.
    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click", (el) => {
            // console.log(e.querySelector(".song-info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".song-info").firstElementChild.innerHTML);
        })

    })

    //Add eventlistener to buttons od music play and pause
    let playSong = document.getElementById("playSong");
    playSong.addEventListener("click", (e) => {
        if (currentSong.paused) {
            currentSong.play();
            playSong.src = "pause.svg"
        }
        else {
            currentSong.pause();
            playSong.src = "play.svg"
        }
    })

    let bar = document.querySelector(".seekbar");
    let circle = document.querySelector(".circle");

    currentSong.addEventListener("timeupdate", () => {
        const current = currentSong.currentTime;
        const duration = currentSong.duration;

        if (!isNaN(duration)) {
            document.querySelector(".s-time").innerHTML = `${secondsToMinutes(current)} / ${secondsToMinutes(duration)}`;
        } else {
            document.querySelector(".s-time").innerHTML = `${secondsToMinutes(current)} / 00:00`;
        }

        if (!isNaN(duration)) {
            const barWidth = bar.getBoundingClientRect().width;

            const progress = ((current / duration) * barWidth) - 5;

            // 3. Set circle position in px
            circle.style.left = `${progress}px`;
        }
    });

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        // document.querySelector(".circle").style.left = `${e.offsetX}px`;
        const barWidth = bar.getBoundingClientRect().width;
        const clickX = e.offsetX;

        // Move the circle
        circle.style.left = `${clickX}px`;

        // Seek the audio
        const duration = currentSong.duration;
        if (!isNaN(duration)) {
            const newTime = (clickX / barWidth) * duration;
            currentSong.currentTime = newTime;
        }
    })

    currentSong.addEventListener("ended", () => {
        currentSong.currentTime = 0;
        playSong.src = "play.svg"
    })

}

main()