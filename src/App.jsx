import React, { useState, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls,Float, Stars,  } from "@react-three/drei";
import {  DepthOfField, EffectComposer, Noise, Vignette, Scanline, BrightnessContrast  } from '@react-three/postprocessing'
import { Leva, useControls } from 'leva';
import { Cartridge } from "./components/Cartridge";
import MusicPlayer from 'react-jinke-music-player';
import 'react-jinke-music-player/assets/index.css';
import { Console } from "./components/Console";
import { Room } from "./components/Room";




const Scene = ({ onCartridgeClick, activeCartridge, cartridges }) => {
  return (
    <> 

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
              castShadows
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
      <Room />
      <Console />
    </>
  );
};


const CameraLogger = () => {
  const { camera } = useThree();

  useEffect(() => {
    console.log('Camera Position:', camera.position);
  }, [camera.position]);

  return null; // This component does not render anything
};



const App = () => {
  const [cartridges, setCartridges] = useState([]);
  const [activeCartridge, setActiveCartridge] = useState(null);
  const musicPlayerRef = useRef();
  const sfxin = new Audio('/sfxin.mp3')
  const sfxout = new Audio('/sfxout.mp3')



  // const light1Props = useControls('Light 1', {
  //   intensity: { value: 0.7, min: 0, max: 2, step: 0.1 },
  //   positionX: { value: 10, min: -50, max: 50, step: 0.1 },
  //   positionY: { value: 10, min: -50, max: 50, step: 0.1 },
  //   positionZ: { value: 10, min: -50, max: 50, step: 0.1 },
  //   angle: { value: Math.PI / 4, min: 0, max: Math.PI / 2, step: 0.1 },
  //   penumbra: { value: 0.5, min: 0, max: 1, step: 0.1 }
  // });
  
  // // Leva controls for the second spotlight
  // const light2Props = useControls('Light 2', {
  //   intensity: { value: 0.7, min: 0, max: 2, step: 0.1 },
  //   positionX: { value: -10, min: -50, max: 50, step: 0.1 },
  //   positionY: { value: 10, min: -50, max: 50, step: 0.1 },
  //   positionZ: { value: 10, min: -50, max: 50, step: 0.1 },
  //   angle: { value: Math.PI / 4, min: 0, max: Math.PI / 2, step: 0.1 },
  //   penumbra: { value: 0.5, min: 0, max: 1, step: 0.1 }
  // });
  
  // Leva controls for the third spotlight
  const light3Props = useControls('Light 3', {
    intensity: { value: 3.5, min: 0, max: 10, step: 0.1 },
    positionX: { value: -3.5, min: -50, max: 50, step: 0.1 },
    positionY: { value: 26.8, min: -50, max: 50, step: 0.1 },
    positionZ: { value: -0.1, min: -50, max: 50, step: 0.1 },
    angle: { value: 1.1, min: 0, max: Math.PI / 2, step: 0.1 },
    penumbra: { value: 0.2, min: 0, max: 1, step: 0.1 }
  });
  



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
    <div style={{
          position: 'absolute',
          top: '15px', // Adjust the positioning as needed
          left: '15px',
          color: 'white', // Set text color
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: background color for better readability
          padding: '10px',
          fontFamily: 'monospace',
          textTransform: 'uppercase',
          fontSize: '15px', // Adjust the font size as needed
          zIndex: 100 // Ensure the text is above the canvas layers
        }}>
        Delicate Scam Records:<br />
        Demos by <a href="https://instagram.com/galshaya" target="_blank" rel="noopener noreferrer" style={{color: 'inherit'}}>Gal Shaya</a> 2021-Present
      </div>
      <Canvas shadows camera={{ fov: 70, position: [-16.54, 7.034, 0.064] }}>
        <OrbitControls />
        <CameraLogger />
        <Scene onCartridgeClick={handleCartridgeClick} activeCartridge={activeCartridge} cartridges={cartridges} />
        <ambientLight intensity={0.5} />
  {/* Spotlight 1 */}
  {/* <spotLight
    castShadow
    position={[light1Props.positionX, light1Props.positionY, light1Props.positionZ]}
    intensity={light1Props.intensity}
    angle={light1Props.angle}
    penumbra={light1Props.penumbra}
    target={Console.position}
    decay={2}
    distance={50}
    shadow-mapSize-width={2048}
    shadow-mapSize-height={2048}
    shadow-bias={-0.0001}
    // ... (other properties)
  /> */}

  {/* Spotlight 2 */}
  {/* <spotLight
    castShadow
    position={[light2Props.positionX, light2Props.positionY, light2Props.positionZ]}
    intensity={light2Props.intensity}
    angle={light2Props.angle}
    penumbra={light2Props.penumbra}
    target={Console.position}
    decay={2}
    distance={50}
    shadow-mapSize-width={2048}
    shadow-mapSize-height={2048}
    shadow-bias={-0.0001}
    // ... (other properties)
  /> */}

  {/* Spotlight 3 */}
  <spotLight
    castShadow
    position={[light3Props.positionX, light3Props.positionY, light3Props.positionZ]}
    intensity={light3Props.intensity}
    angle={light3Props.angle}
    penumbra={light3Props.penumbra}
    target={Console.position}
    decay={2}
    distance={50}
    shadow-mapSize-width={2048}
    shadow-mapSize-height={2048}
    shadow-bias={-0.0001}
    // ... (other properties)
  />

        {/* <Environment preset="warehouse" /> */}

        <EffectComposer>
        <DepthOfField focusDistance={0.5} focalLength={2} bokehScale={0.5} height={480} />
        {/* <Bloom luminanceThreshold={0.7} luminanceSmoothing={0.9} height={300} /> */}
        <Noise opacity={0.07}  />
        <Vignette eskil={false} offset={0.15} darkness={1.0} />
        <Scanline  density={10} opacity={0.25} />
        <BrightnessContrast brightness={0.12} contrast={0.3} />
        
      </EffectComposer>
      
      </Canvas>
      <Leva hidden />
      
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
