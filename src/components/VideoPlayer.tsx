import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import * as dashjs from 'dashjs';

// Vite proxy: /tv8proxy → mytivu.it → 302 → URL Akamai fresca con token valido
// HLS.js segue il redirect automaticamente; i segmenti vanno direttamente su Akamai (CORS ok)
const TV8_PROXY = '/tv8proxy';

interface Channel {
    name: string;
    url: string;
    specialStream?: 'tv8';
}

interface PlayerProps { channel: Channel; }

const VideoPlayer: React.FC<PlayerProps> = ({ channel }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { url, specialStream } = channel;

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !url) return;

        let hls:  Hls  | null = null;
        let dash: dashjs.MediaPlayerClass | null = null;

        video.pause();
        video.removeAttribute('src');
        video.load();

        const finalUrl = specialStream === 'tv8'
            ? TV8_PROXY
            : url;

        if (url.includes('.mpd')) {
            dash = dashjs.MediaPlayer().create();
            dash.initialize(video, finalUrl, true);
        } else if (Hls.isSupported()) {
            hls = new Hls({ enableWorker: true });
            hls.loadSource(finalUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari nativo (iOS): supporta HLS direttamente
            video.src = finalUrl;
            video.play().catch(() => {});
        }

        return () => {
            hls?.destroy();
            dash?.destroy();
        };
    }, [specialStream, url]);

    return (
        <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#000',
        }}>
            <video
                ref={videoRef}
                controls
                autoPlay
                playsInline
                style={{
                    width: '100%', height: '100%',
                    maxHeight: '100%', maxWidth: '100%',
                    objectFit: 'contain', outline: 'none',
                }}
            />
        </div>
    );
};

export default VideoPlayer;