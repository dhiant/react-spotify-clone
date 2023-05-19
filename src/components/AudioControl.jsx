import { AiOutlineStepBackward, AiOutlineStepForward } from "react-icons/ai";
import {
  MdOutlineFavoriteBorder,
  MdOutlinePictureInPictureAlt,
  MdPauseCircle,
  MdPlayCircle,
} from "react-icons/md";
import { TbArrowsShuffle, TbHeartFilled, TbMicrophone2 } from "react-icons/tb";
import { RxLoop } from "react-icons/rx";
import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from "react-icons/hi2";
import { useContext, useEffect, useRef, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import AudioControlLoader from "./AudioControlLoader";

const AudioControl = () => {
  const [isMute, setIsMute] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [enableShuffle, setEnableShuffle] = useState(false);
  const [enableRepeat, setEnableRepeat] = useState(false);
  const [setFavourite, setSetFavourite] = useState(false);
  const [setVolume, setSetVolume] = useState(0.12);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);

  const { state, setPlaying } = useContext(GlobalContext);
  let { img, text, title } = state.trackData;
  let isPlaying = state.playing;

  const audioRef = useRef(null);

  const getBackgroundSize = () => {
    return {
      backgroundSize: `${setVolume * 100}% 100%`,
    };
  };

  // adjust volume range
  const handleVolume = (initialVolume) => {
    // convert string value to float
    let volumeInFloat = parseFloat(initialVolume);
    audioRef.current.volume = volumeInFloat;
    setSetVolume(volumeInFloat);
  };

  // play/pause audio
  const handleAudioPlayPause = () => {
    if (isPlaying) {
      setAudioCurrentTime(audioRef.current.currentTime);
    }

    setPlaying(!isPlaying);
  };

  useEffect(() => {
    let audioElement = audioRef.current;
    audioElement.volume = 0.12;

    if (state.previewURL) {
      audioElement.src = state.previewURL;

      if (state.playing) {
        audioElement.currentTime = audioCurrentTime;
        audioElement.play();
      } else {
        audioElement.pause();
      }
    }

    const isAudioPlayCompletely = () => {
      if (audioElement.duration === audioElement.currentTime) {
        setPlaying(false);
      }
    };

    audioElement.addEventListener("timeupdate", isAudioPlayCompletely);

    return () => {
      audioElement.removeEventListener("timeupdate", isAudioPlayCompletely);
    };
  }, [state.previewURL, state.playing, audioCurrentTime, setPlaying]);

  return (
    <div className="z-10 fixed bottom-0 w-full h-20 sm:h-24 p-5 bg-secondary border-t-2 border-[#282828]">
      <div className="flex justify-between gap-x-4">
        <div className="w-60 md:max-w-full truncate hidden sm:flex basis-1/3 text-white items-center">
          {img || title || text ? (
            <>
              <img src={img} alt="song_picture" className="w-14 h-14 rounded" />
              <div className="flex flex-col pl-3">
                <h4 className="text-base font-normal truncate">{title}</h4>
                <p className="text-gray-500 text-sm truncate">
                  {text || text.map((item) => item)}
                </p>
              </div>
              <div className="pl-4 flex gap-x-4">
                {setFavourite ? (
                  <TbHeartFilled
                    color="#1db954"
                    size="22px"
                    title="Save to Your Library"
                    onClick={() => setSetFavourite(!setFavourite)}
                  />
                ) : (
                  <MdOutlineFavoriteBorder
                    fill="grey"
                    size="22px"
                    title="Save to Your Library"
                    onClick={() => setSetFavourite(!setFavourite)}
                  />
                )}
                <MdOutlinePictureInPictureAlt
                  fill="grey"
                  size="20px"
                  title="Picture in picture"
                />
              </div>
            </>
          ) : (
            <div className="pl-10">
              <AudioControlLoader />
            </div>
          )}
        </div>

        <div className="flex-1 text-white flex basis-1 justify-center items-center gap-x-4">
          <TbArrowsShuffle
            size="20px"
            title="Enable Shuffle"
            stroke={enableShuffle ? "#1db954" : "grey"}
            onClick={() => setEnableShuffle(!enableShuffle)}
          />
          <AiOutlineStepBackward size="24px" fill="#9d9d9d" title="Previous" />
          <audio ref={audioRef} muted={isMute}></audio>
          {isPlaying ? (
            <MdPauseCircle
              size="40px"
              onClick={handleAudioPlayPause}
              title="Pause"
            />
          ) : (
            <MdPlayCircle
              size="40px"
              onClick={handleAudioPlayPause}
              title="Play"
            />
          )}
          <AiOutlineStepForward size="24px" fill="#9d9d9d" title="Next" />
          <RxLoop
            size="20px"
            title="Enable Repeat"
            color={enableRepeat ? "#1db954" : "grey"}
            onClick={() => setEnableRepeat(!enableRepeat)}
          />
        </div>
        <div className="w-fit py-4 text-white hidden sm:flex items-center basis-1/3 gap-x-4 justify-end">
          <TbMicrophone2
            size="22px"
            stroke={showLyrics ? "#1db954" : "grey"}
            className="cursor-pointer"
            title="Lyrics"
            onClick={() => setShowLyrics(!showLyrics)}
          />
          {isMute ? (
            <HiOutlineSpeakerXMark
              size="22px"
              title="Unmute"
              onClick={() => setIsMute(!isMute)}
            />
          ) : (
            <HiOutlineSpeakerWave
              size="22px"
              title="Mute"
              onClick={() => setIsMute(!isMute)}
            />
          )}
          <div className="inline -mt-1">
            <input
              type="range"
              value={setVolume}
              onChange={(e) => handleVolume(e.target.value)}
              min="0"
              max="1"
              step="0.0001"
              style={getBackgroundSize()}
              className="accent-[#1db954] w-3/4 h-1 rounded-lg bg-gradient-to-r from-green to-green bg-no-repeat appearance-none cursor-pointer dark:bg-gray-700 "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioControl;
