import React from 'react';

const EmbeddedVideo = () => {
  return (
    <div style={{ maxWidth: '100%', height: 'auto', aspectRatio: '16/9', boxShadow:"-1px 19px 20px 1px black" }}>
      <iframe
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/Pt7obxQv1mQ?rel=0&modestbranding=1"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default EmbeddedVideo;