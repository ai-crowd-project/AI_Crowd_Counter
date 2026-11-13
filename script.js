
const video = document.getElementById("camera");
const startButton = document.getElementById("startCamera");
const stopButton = document.getElementById("stopCamera");
const cameraStatus = document.getElementById("cameraStatus");

let cameraStream = null;

// カメラを起動
startButton.addEventListener("click", async () => {
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "environment"
            },
            audio: false
        });

        video.srcObject = cameraStream;
        cameraStatus.textContent = "カメラ起動中";
    } catch (error) {
        console.error("Camera Error:", error);
        cameraStatus.textContent = "カメラを起動できませんでした";
    }
});

// カメラを停止
stopButton.addEventListener("click", () => {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
        video.srcObject = null;
        cameraStatus.textContent = "カメラは停止中です";
    }
});
