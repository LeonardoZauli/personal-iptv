import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import * as dashjs from 'dashjs';

interface PlayerProps { url: string; }

const VideoPlayer: React.FC<PlayerProps> = ({ url }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const video = videoRef.current;
        if (!video || !url) return;

        let hls: Hls | null = null;
        let dashPlayer: dashjs.MediaPlayerClass | null = null;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLoading(true);
        video.pause();
        video.removeAttribute('src');
        video.load();

        const needsProxy = url.includes('rai.it') || url.includes('mediapolis') || url.startsWith('http://');
        const finalUrl = needsProxy ? `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}` : url;

        if (url.includes('.mpd')) {
            dashPlayer = dashjs.MediaPlayer().create();
            dashPlayer.initialize(video, finalUrl, true);
            dashPlayer.on('canPlay', () => setIsLoading(false));
        } else {
            if (Hls.isSupported()) {
                hls = new Hls({ enableWorker: true });
                hls.loadSource(finalUrl);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = finalUrl;
            }
        }

        return () => {
            if (hls) hls.destroy();
            if (dashPlayer) dashPlayer.destroy();
        };
    }, [url]);

    // All'interno del return di VideoPlayer.tsx, usa esattamente questo stile
    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#000'
        }}>
            {isLoading && <div className="loading-spinner"></div>}
            <video
                ref={videoRef}
                controls
                autoPlay
                playsInline
                webkit-playsinline="true"
                onCanPlay={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
                style={{
                    width: '100%',
                    height: '100%',
                    maxHeight: '100%', /* Impedisce al video di superare il container */
                    maxWidth: '100%',
                    objectFit: 'contain', /* Mantiene le proporzioni senza tagliare nulla */
                    outline: 'none'
                }}
            />
        </div>
    );
};

export default VideoPlayer;