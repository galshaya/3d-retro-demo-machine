import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment,Float, Stars } from "@react-three/drei";
import { Cartridge } from "./components/Cartridge";
import MusicPlayer from 'react-jinke-music-player';
import 'react-jinke-music-player/assets/index.css';
import { Console } from "./components/Console";


const Scene = ({ onCartridgeClick, activeCartridge, cartridges }) => {
  return (
    <>
      <Environment preset="warehouse" background={false} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {cartridges.map(cartridge => {
        const isActive = activeCartridge === cartridge.name;
        const floatParams = isActive 
          ? { speed: 0, floatIntensity: 0 } 
          : { speed: 5, rotationIntensity: 0, floatIntensity: 1.2 };

        return (
          <Float 
            key={cartridge.key}
            {...floatParams}
          >
            <Cartridge 
              name={cartridge.name}
              active={isActive}
              originalRotation={cartridge.rotation} // Original rotation
              originalPosition={cartridge.position} // Original position
              stickerCover={cartridge.stickerCover}
              onClick={() => onCartridgeClick(cartridge.name)}
            />
          </Float>
        );
      })}
      <Console />
    </>
  );
};


  const App = () => {
  const [cartridges, setCartridges] = useState([]);
  const [activeCartridge, setActiveCartridge] = useState(null);
  const musicPlayerRef = useRef();
  const sfxin = new Audio('/sfxin.mp3')
  const sfxout = new Audio('/sfxout.mp3')

  useEffect(() => {
    const fetchCartridges = async () => {
      try {
        const response = await fetch(`https://cdn.contentful.com/spaces/cmls592r3a51/environments/master/entries?access_token=k9mxU7gb12ap5gmE2j4LOX1d_xveLz6HPxWeGYPrF4Y&content_type=cartridges&include=2`);
        const data = await response.json();
        const rotations = [[0, Math.PI /-10 ,0],[0, Math.PI /10 ,0],[0, Math.PI /-9 ,0],[0, Math.PI /9 ,0]]

        const processedCartridges = data.items.map(item => {
          const stickerCoverAsset = data.includes.Asset.find(asset => asset.sys.id === item.fields.stickerCover.sys.id);
          const musicSrcAsset = data.includes.Asset.find(asset => asset.sys.id === item.fields.musicSrc.sys.id);
          const randomRotation = rotations[Math.floor(Math.random() * rotations.length)]; // Assign a random rotation for each cartridge

          // Parse position from string to array of numbers
          let position = [0, 0, 0]; // Default position
          try {
            position = JSON.parse(item.fields.position);
          } catch (error) {
            console.error("Error parsing position for cartridge:", item.fields.name, error);
          }
    
          return {
            key: item.fields.key,
            name: item.fields.name,
            stickerCover: stickerCoverAsset.fields.file.url,
            musicSrc: musicSrcAsset.fields.file.url,
            position: position,
            rotation: randomRotation
          };
        });
        setCartridges(processedCartridges);
      } catch (error) {
        console.error("Error fetching data from Contentful:", error);
      }
    };

    fetchCartridges();
  }, []);

  const handleCartridgeClick = (name) => {
    

    if (activeCartridge === name) {
      setActiveCartridge(null);
      musicPlayerRef.current.audio.pause();
      sfxout.play();
    } else {
      setActiveCartridge(name);
      sfxin.play();
      const songIndex = cartridges.findIndex(cartridge => cartridge.name === name);
      setTimeout( () => {
        musicPlayerRef.current.updatePlayIndex(songIndex);
        musicPlayerRef.current.audio.play();  
      },1200 )
    }
  };

  const audioList = cartridges.map(cartridge => ({
    name: cartridge.name,
    musicSrc: cartridge.musicSrc
  }));

  return (
    <>
      <Canvas camera={{ fov: 70, position: [-6, 4, 3] }}>
        <OrbitControls />
        <Scene onCartridgeClick={handleCartridgeClick} activeCartridge={activeCartridge} cartridges={cartridges} />
      </Canvas>
      <MusicPlayer

        ref={musicPlayerRef}
        audioLists={audioList}
        autoPlay={false}
        mode="full"
        showDownload={false}
        showThemeSwitch={false}
        preload={false}
        glassBg={true}
        responsive={true}
        toggleMode = {true}
        showLyric = {true}
        // Removed onAudioPlay and onAudioPause callbacks
      />
    </>
  );
};

export default App;
