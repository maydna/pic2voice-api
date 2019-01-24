import React from 'react';
import title from './title.png';
import { Divider, Header, Image, Segment } from 'semantic-ui-react'
//without any state
const Logo = ({name, entries, isSignedIn }) => {
      return (
        <div>
          <div className='logolayout'>
            <p className='logo f5'>
              {'Try uploading an image and it will convert to a voice message!'}
            </p>
            <Image src={title} size='large'/>
          </div>
          <Divider />
        </div>
      );
}

export default Logo;
