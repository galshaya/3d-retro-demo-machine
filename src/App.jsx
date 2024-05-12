import React, { useState, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls,Float, Stars,  } from "@react-three/drei";
import {  DepthOfField, EffectComposer, Noise, Vignette, Scanline, BrightnessContrast  } from '@react-three/postprocessing'
import { Leva, useControls } from 'leva';
import { RugPortal } from "./components/RugPortal";
import { Perf } from "r3f-perf";
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
      <RugPortal/>
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
  const [showModal, setShowModal] = useState(true); // State to show/hide the modal
  const [firstInteraction, setFirstInteraction] = useState(true); // State to manage the first interaction
  const [cartridges, setCartridges] = useState([]);
  const [activeCartridge, setActiveCartridge] = useState(null);
  const musicPlayerRef = useRef();
  const sfxin = new Audio('/sfxin.mp3')
  const sfxout = new Audio('/sfxout.mp3')
  const [playerMode, setPlayerMode] = useState('full'); // Default mode
  const [isDesktop, setIsDesktop] = useState(false);
  const [useEffectComposer, setUseEffectComposer] = useState(true); // New state for toggle
  const [currentCover, setCurrentCover] = useState('');
  const [currentSongName, setCurrentSongName] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  

  useEffect(() => {
    const checkIfDesktop = () => {
      // Logic to determine if the device is desktop
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isMobile = /iphone|ipad|android|windows phone/.test(userAgent);
      const isDesktop = !isMobile && window.innerWidth > 768; // Adjust as needed
      setIsDesktop(isDesktop);
    };

    checkIfDesktop();
    window.addEventListener('resize', checkIfDesktop);

    return () => {
      window.removeEventListener('resize', checkIfDesktop);
    };
  }, []);



  useEffect(() => {
    // Function to update the player mode based on screen width
    const updatePlayerMode = () => {
      const mode = window.innerWidth > 768 ? 'full' : 'mini'; // Change 768 to your breakpoint for mobile
      setPlayerMode(mode);
    };

    // Update player mode on mount and when window resizes
    updatePlayerMode();
    window.addEventListener('resize', updatePlayerMode);

    // Cleanup listener
    return () => window.removeEventListener('resize', updatePlayerMode);
  }, []);

  const handleOkayClick = () => {
    // Close the modal
    setShowModal(false);
  
    // If it's the first interaction, just play and pause the audio to unlock it
    if (firstInteraction && musicPlayerRef.current) {
      musicPlayerRef.current.audio.play().then(() => {
        setTimeout(() => {
          musicPlayerRef.current.audio.pause();
          setFirstInteraction(false); // Update the state to know that the first interaction has occurred
        }, 100); // Short delay before pausing, adjust the time as needed
      }).catch(error => console.error('Error playing audio:', error));
    }
  };

  const handleToggleEffectComposer = () => {
    setUseEffectComposer(!useEffectComposer); // Toggle the state
  };



  
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
          const coverAsset = data.includes.Asset.find(asset => asset.sys.id === item.fields.cover.sys.id);
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
            rotation: randomRotation,
            cover: coverAsset.fields.file.url,
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
    if (isAnimating) return; // Exit if an animation is in progress
    setIsAnimating(true); // Prevent further clicks
    // Simulate animation end after 1200ms
    setTimeout(() => {
      setIsAnimating(false);
    }, 100);

    // Find the clicked cartridge
    const cartridge = cartridges.find(cartridge => cartridge.name === name);

    if (activeCartridge === name) {
      setActiveCartridge(null);
      musicPlayerRef.current.audio.pause();
      sfxout.play();
      setCurrentCover(''); // Reset the current cover when no song is active
      setCurrentSongName(''); // Reset the current song name
    } else {
      setActiveCartridge(name);
      sfxin.play();
      setCurrentCover(cartridge.cover); // Update the current cover to the clicked cartridge's cover
      setCurrentSongName(cartridge.name); // Update the current song name
      const songIndex = cartridges.findIndex(cartridge => cartridge.name === name);
      setTimeout(() => {
        musicPlayerRef.current.updatePlayIndex(songIndex);
        musicPlayerRef.current.audio.play();
      }, 1200);
    }
  };

  const handleAnimationStart = () => {
    setIsAnimating(true);

    // Use setTimeout to wait for the animation duration before setting isAnimating back to false
    setTimeout(() => {
      handleAnimationEnd(); // Call the function that handles the end of the animation
    }, 1200); // Match this duration to the length of your animation
  };

  const handleAnimationEnd = () => {
    setIsAnimating(false);
  };



  const audioList = cartridges.map(cartridge => ({
    name: cartridge.name,
    musicSrc: cartridge.musicSrc,
    cover: cartridge.cover,
  }));

  const bottomSpacing = isDesktop ? '8%' : '15px';


  return (
    <>
    {showModal && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          fontFamily: 'monospace',
          textTransform: 'uppercase',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '5px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <p>Click a cartridge to start playing, move in the space in 3d. This is a beta version, if a song doesn't start playing, hit the headphones and hit play and pause once, enjoy!</p>
          <button onClick={handleOkayClick} style={{
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer'
          }}>Okay</button>
        </div>
      )}
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
      {isDesktop && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          zIndex: 100
        }} onClick={handleToggleEffectComposer}>
          <span style={{
            fontFamily: 'monospace',
            fontSize: '14px',
            marginRight: '10px',
            color: 'white',
            userSelect: 'none'
          }}>
            {useEffectComposer ? 'Cinematic mode (heavy)' : 'Basic mode (light)'}
          </span>
          <div style={{
            width: '40px',
            height: '20px',
            backgroundColor: useEffectComposer ? '#dbd35e' : '#ccc',
            borderRadius: '20px',
            padding: '2px',
            transition: 'background-color 0.2s',
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: 'white',
              borderRadius: '50%',
              transition: 'transform 0.2s',
              transform: useEffectComposer ? 'translateX(20px)' : 'translateX(0px)'
            }} />
          </div>
        </div>
      )}
      <Canvas shadows camera={{ fov: 70, position: [-16.54, 7.034, 0.064] }}>
        <OrbitControls />
        <CameraLogger />
        <Scene 
          onCartridgeClick={handleCartridgeClick} 
          activeCartridge={activeCartridge} 
          cartridges={cartridges}
        />
        <ambientLight intensity={0.5} />

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

        {isDesktop && useEffectComposer && (
          <EffectComposer>
            <DepthOfField focusDistance={0.5} focalLength={2} bokehScale={0.5} height={480} />
            <Noise opacity={0.07} />
            <Vignette eskil={false} offset={0.15} darkness={1.0} />
            <Scanline density={10} opacity={0.25} />
            <BrightnessContrast brightness={0.12} contrast={0.3} />
          </EffectComposer>
        )}
      {/* <Perf position="top-left"/> */}
      </Canvas>
      <Leva hidden />
     
      <div style={{
        position: 'absolute',
        bottom: bottomSpacing,
        left: '15px',
        display: 'flex',
        alignItems: 'center',
        zIndex: 100,
        fontFamily: 'monospace',
        color: 'white',
        opacity: '0.7',
      }}>
        {currentCover && (
          <div style={{
            width: '70px',
            height: '70px',
            backgroundImage: `url(${currentCover})`,
            backgroundSize: 'cover',
            marginRight: '10px',
          }} />
        )}
        {currentSongName && (
          <div style={{
            fontSize: '14px',
          }}>
            {currentSongName}
          </div>
        )}
      </div>


      {/* {currentSongName && (
        <p>currentSongName</p>
      )} */}

      
      <MusicPlayer
        ref={musicPlayerRef}
        audioLists={audioList}
        autoPlay={false}
        mode={playerMode}
        defaultPosition={{bottom:15, right:15 }}
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