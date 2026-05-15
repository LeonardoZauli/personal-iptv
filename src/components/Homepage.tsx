import React, { useState } from 'react';
import './Homepage.css';
import IptvList from '../scripts/IptvList';
import VideoPlayer from './VideoPlayer';

interface Channel {
    name: string;
    url: string;
    logo: string;
    specialStream?: 'tv8';
}

const Homepage: React.FC = () => {
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

    return (
        <div className="home-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2 className="sidebar-brand">
                        IPTV<span className="sidebar-brand-accent">ITA</span>
                    </h2>
                </div>
                <div className="sidebar-content">
                    <IptvList
                        onSelectChannel={(ch) => setSelectedChannel(ch)}
                        selectedChannelUrl={selectedChannel?.url ?? null}
                    />
                </div>
            </aside>

            <main className="main-viewport">
                <header className="home-header">
                    <p className="home-subtitle">
                        {selectedChannel ? 'STAI GUARDANDO' : 'PREMIUM EXPERIENCE'}
                    </p>
                    <h1 className="home-title">
                        {selectedChannel ? selectedChannel.name : 'Live TV'}
                    </h1>
                </header>

                <section className="player-container">
                    {selectedChannel ? (
                        <VideoPlayer
                            key={`${selectedChannel.specialStream ?? 'default'}:${selectedChannel.url}`}
                            channel={selectedChannel}
                        />
                    ) : (
                        <div className="placeholder-player" role="status" aria-live="polite">
                            <div className="placeholder-icon" aria-hidden="true">📺</div>
                            <p className="placeholder-text">Seleziona un canale</p>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Homepage;