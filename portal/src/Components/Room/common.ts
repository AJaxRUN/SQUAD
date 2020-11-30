export function closeStream(stream: MediaStream|null|undefined) {
    if(stream)
        stream.getTracks().forEach(track => {
            track.stop();
        });
}