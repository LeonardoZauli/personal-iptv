import React, { useEffect, useState } from 'react';

// 1. Definiamo l'interfaccia per il Canale
interface Channel {
    name: string;
    logo: string;
    group: string;
    chNo: string;
    id: string;
    url: string;
    specialStream?: 'tv8';
}

// 2. Definiamo l'interfaccia per le Props (fondamentale per comunicare con Homepage)
interface IptvListProps {
    onSelectChannel: (channel: Channel) => void;
    selectedChannelUrl?: string | null;
}

const IPTV_URL = "https://raw.githubusercontent.com/Tundrak/IPTV-Italia/main/iptvitaplus.m3u";

function applyChannelOverrides(channel: Channel): Channel {
    const isTv8 = channel.id === 'Tv8.it' || channel.name.trim().toUpperCase() === 'TV8';

    if (isTv8) {
        return {
            ...channel,
            url: 'https://hlslive-web-gcdn-skycdn-it.akamaized.net/TACT/11223/tv8web/master.m3u8',
            specialStream: 'tv8'
        };
    }

    return channel;
}

function parseM3U(data: string): Channel[] {
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
                list.push(applyChannelOverrides(fullChannel));
                currentChannel = null;
            }
        }
    });

    return list;
}

const IptvList: React.FC<IptvListProps> = ({ onSelectChannel, selectedChannelUrl }) => {
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

    if (loading) return <div className="channels-loading">Caricamento...</div>;

    return (
        <div className="channels-list">
            {channels.map((ch, index) => (
                <button
                    key={`${ch.id}-${index}`}
                    className={`channel-item ${selectedChannelUrl === ch.url ? 'is-active' : ''}`}
                    // Azione corretta: passa l'intero oggetto canale alla Homepage
                    onClick={() => onSelectChannel(ch)}
                    type="button"
                >
                    {ch.logo ? (
                        <img src={ch.logo} alt="" className="channel-logo-mini" />
                    ) : (
                        <div className="channel-logo-mini channel-logo-fallback" aria-hidden="true" />
                    )}
                    <span className="channel-name">{ch.name}</span>
                </button>
            ))}
        </div>
    );
};

export default IptvList;