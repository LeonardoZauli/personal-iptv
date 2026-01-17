import React, { useState } from 'react';
import './Homepage.css';
import IptvList from '../scripts/IptvList';
import VideoPlayer from './VideoPlayer';

interface Channel {
    name: string;
    url: string;
    logo: string;
}

const Homepage: React.FC = () => {
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

    return (
        <div className="home-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2 className="sidebar-brand">IPTV<span style={{color: 'var(--accent)'}}>ITA</span></h2>
                </div>
                <div className="sidebar-content">
                    <IptvList onSelectChannel={(ch) => setSelectedChannel(ch)} />
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
                        <VideoPlayer url={selectedChannel.url} />
                    ) : (
                        <div className="placeholder-player" style={{textAlign: 'center'}}>
                            <div style={{fontSize: '3rem', opacity: 0.2}}>📺</div>
                            <p style={{fontSize: '0.8rem', opacity: 0.5}}>Seleziona un canale</p>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Homepage;