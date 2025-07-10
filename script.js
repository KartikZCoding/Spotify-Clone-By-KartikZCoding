

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

async function main() {

    let songs = await getSongs()
    console.log(songs);

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


}

main()