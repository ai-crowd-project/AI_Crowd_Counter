
const video = document.getElementById("camera");
const startButton = document.getElementById("startCamera");
const stopButton = document.getElementById("stopCamera");
const cameraStatus = document.getElementById("cameraStatus");

const peopleCount = document.getElementById("peopleCount");

let cameraStream = null;
let model = null;
let isDetecting = false;

// カメラ開始
startButton.addEventListener("click", async () => {
    try {
        cameraStatus.textContent = "AIモデルを読み込み中...";

        if (!model) {
            model = await cocoSsd.load();
        }

        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
            audio: false
        });

        video.srcObject = cameraStream;
        await video.play();

        isDetecting = true;
        cameraStatus.textContent = "人数を測定中";
        detectPeople();

    } catch (error) {
        console.error(error);
        cameraStatus.textContent = "起動できませんでした";
    }
});

// 人物検出
async function detectPeople() {
    if (!isDetecting || !model) return;

    try {
        const predictions = await model.detect(video);

        const people = predictions.filter(person =>
            person.class === "person" &&
            person.score >= 0.5
        );

        peopleCount.textContent = people.length;

    } catch (error) {
        console.error("Detection Error:", error);
    }

    if (isDetecting) {
        requestAnimationFrame(detectPeople);
    }
}

// カメラ停止
stopButton.addEventListener("click", () => {
    isDetecting = false;

    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }

    video.srcObject = null;
    peopleCount.textContent = "0";
    cameraStatus.textContent = "カメラは停止中です";
});
