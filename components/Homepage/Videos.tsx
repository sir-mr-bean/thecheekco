const Videos = () => {
  return (
    <div className="flex space-x-3 items-center w-full justify-center px-3">
      <div className="pt-16">
        <video
          muted
          autoPlay
          playsInline
          loop
          preload="metadata"
          src="../images/Homepage/video1.mp4"
          height="300"
          width="300"
          className="rounded-xl"
        />
      </div>
      <div className="pt-16">
        <video
          muted
          autoPlay
          playsInline
          loop
          preload="metadata"
          src="../images/Homepage/video2.mp4"
          height="300"
          width="300"
          className="rounded-xl"
        />
      </div>
      <div className="pt-16">
        <video
          muted
          autoPlay
          playsInline
          loop
          preload="metadata"
          src="../images/Homepage/video3.mp4"
          height="300"
          width="300"
          className="rounded-xl"
        />
      </div>
    </div>
  );
};

export default Videos;
