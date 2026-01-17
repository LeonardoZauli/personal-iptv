import React, { useEffect, useState } from 'react';

// 1. Definiamo l'interfaccia per il Canale
interface Channel {
    name: string;
    logo: string;
    group: string;
    chNo: string;
    id: string;
    url: string;
}

// 2. Definiamo l'interfaccia per le Props (fondamentale per comunicare con Homepage)
interface IptvListProps {
    onSelectChannel: (channel: Channel) => void;
}

const IPTV_URL = "https://raw.githubusercontent.com/Tundrak/IPTV-Italia/main/iptvitaplus.m3u";

const IptvList: React.FC<IptvListProps> = ({ onSelectChannel }) => {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                const response = await fetch(IPTV_URL);
                const text = await response.text();
                const parsedChannels = parseM3U(text);

                setChannels(parsedChannels);
                setLoading(false);
            } catch (error) {
                console.error("Errore nel caricamento della lista:", error);
                setLoading(false);
            }
        };

        fetchChannels();
    }, []);

    const parseM3U = (data: string): Channel[] => {
        const lines = data.split('\n');
        const list: Channel[] = [];
        let currentChannel: Partial<Channel> | null = null;

        lines.forEach((line) => {
            line = line.trim();

            if (line.startsWith('#EXTINF')) {
                const name = line.split(',').pop()?.trim() || "Unknown";
                const logo = line.match(/tvg-logo="([^"]*)"/)?.[1] || "";
                const group = line.match(/group-title="([^"]*)"/)?.[1] || "Altri";
                const chNo = line.match(/tvg-chno="([^"]*)"/)?.[1] || "0";
                const id = line.match(/tvg-id="([^"]*)"/)?.[1] || "";

                currentChannel = { name, logo, group, chNo, id };
            } else if (line.startsWith('http')) {
                if (currentChannel) {
                    const fullChannel: Channel = {
                        name: currentChannel.name || "Unknown",
                        logo: currentChannel.logo || "",
                        group: currentChannel.group || "Altri",
                        chNo: currentChannel.chNo || "0",
                        id: currentChannel.id || "",
                        url: line
                    };
                    list.push(fullChannel);
                    currentChannel = null;
                }
            }
        });

        return list;
    };

    if (loading) return <div style={{ color: 'rgba(255,255,255,0.5)', padding: '20px', fontSize: '0.8rem' }}>Caricamento...</div>;

    return (
        <div className="channels-list">
            {channels.map((ch, index) => (
                <div
                    key={`${ch.id}-${index}`}
                    className="channel-item"
                    // Azione corretta: passa l'intero oggetto canale alla Homepage
                    onClick={() => onSelectChannel(ch)}
                >
                    {ch.logo ? (
                        <img src={ch.logo} alt="" className="channel-logo-mini" />
                    ) : (
                        <div className="channel-logo-mini" style={{ background: '#333' }} />
                    )}
                    <span className="channel-name">{ch.name}</span>
                </div>
            ))}
        </div>
    );
};

export default IptvList;