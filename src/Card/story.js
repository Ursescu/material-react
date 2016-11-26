import React from 'react';
import { storiesOf } from '@kadira/storybook';
import Card from './index.jsx';

import '../_story.scss';

storiesOf('Card', module)
    .add('Basic', () => (
        <div>
            <Card>test</Card>
        </div>
    ));