import React from 'react';
import { screen, render } from '@testing-library/react';
import { AboutComponent } from '@routes/about/index.lazy';

 describe('About Page', () => { 
   
     it.each([
         'about-hero-section',
         'about-hero-title',
         'about-hero-text-1',
         'about-hero-text-2',
         'about-hero-text-3',
         'about-hero-text-4',
         'about-project-section',
         'about-project-text-1',
         'about-project-text-2',
         'about-project-text-3',
         'about-image-credit',
        ])('Should render %s', async (testId) => {
         render(<AboutComponent />);
        expect(screen.getByTestId(testId)).toBeInTheDocument();
    })
 })