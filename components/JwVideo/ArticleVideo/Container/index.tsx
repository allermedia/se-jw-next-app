import React from 'react'
interface Props {
  durationMinutes: string,
  title: string,
  thumbnail: string,
  portrait?: boolean,
  children?: React.ReactNode
}

export default function Container({durationMinutes, thumbnail, title, portrait = false, children}: Props) {
    const aspectClass = portrait ? 'video_area__portrait' : ''
    return (
        <div className={`jwplayer_video-videoArea video_area ${aspectClass}`} style={{'backgroundImage': `url('${thumbnail}')`}}>
        {durationMinutes && 
          <div className={`jwplayer_video-time time_left`}>
            <i className={`time_left_icon`}>
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                viewBox="0 0 24 24" xmlSpace="preserve">
                <path fill="none" d="M12,3.4c-4.7,0-8.6,3.8-8.6,8.6c0,4.7,3.8,8.6,8.6,8.6s8.6-3.8,8.6-8.6C20.6,7.3,16.7,3.4,12,3.4z M17,15
                  c-0.2,0.3-0.5,0.5-0.8,0.5c-0.2,0-0.3,0-0.5-0.1L11.5,13C11.2,12.8,11,12.4,11,12c0,0,0-0.1,0-0.1V5.7c0-0.5,0.4-1,1-1s1,0.4,1,1
                  v5.8l3.7,2.1C17.1,13.9,17.3,14.5,17,15z"/>
                <path fill="currentColor" d="M12,1.5C6.2,1.5,1.5,6.2,1.5,12c0,5.8,4.7,10.5,10.5,10.5c5.8,0,10.5-4.7,10.5-10.5C22.5,6.2,17.8,1.5,12,1.5z M12,20.6
                  c-4.7,0-8.6-3.8-8.6-8.6c0-4.7,3.8-8.6,8.6-8.6s8.6,3.8,8.6,8.6C20.6,16.7,16.7,20.6,12,20.6z"/>
                <path fill="currentColor" d="M16.7,13.7L13,11.5V5.7c0-0.5-0.4-1-1-1s-1,0.4-1,1v6.2c0,0.1,0,0.1,0,0.1c0,0.4,0.1,0.7,0.5,0.9l4.2,2.4
                  c0.2,0.1,0.3,0.1,0.5,0.1c0.3,0,0.7-0.2,0.8-0.5C17.3,14.5,17.1,13.9,16.7,13.7z"/>
              </svg>
            </i>
            {durationMinutes}
          </div>
        }
        {title && 
          <div className={`up_next`}>
              <p className={`up_next_title jwplayer_video-upNext-title`}>Efter reklamen: <span className="jwplayer_video-upNext-title-text">{title}</span></p>
               {durationMinutes && 
                  <p className={`up_next_time jwplayer_video-upNext-time`}>
                      ({durationMinutes})
                  </p>
              } 
          </div>
        }
        {children}
      </div>
    )
}