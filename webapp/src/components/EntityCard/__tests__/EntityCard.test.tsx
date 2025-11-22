import React from 'react';
import { render, screen } from '@testing-library/react';
import { EntityCard } from '@components/EntityCard/EntityCard';

jest.mock('@src/consts', () => ({
  VITE_MODE: 'development',
  VITE_CF_URL: 'https://example.com',
  VITE_FOOTER_COPYRIGHT: 'Test Copyright',
  VITE_PORTFOLIO_URL: 'https://example.com',
  VITE_GTAG_ID: 'Test GTag ID',
}));

describe('EntityCard', () => {
  const mockProps = {
    img: 'https://example.com/image.png',
    desc: {
      name: 'Test Item',
      scientific_name: 'Test Scientific Name',
      habitat: 'Test Habitat',
      coloration: 'Test Coloration',
      size: 'Test Size',
      diet: 'Test Diet',
      lifespan: 'Test Lifespan',
      special_abilities: 'Test Abilities',
      fun_fact: 'Test Fun Fact',
      model: 'unknown',
      date: 'Test Date',
      prompt: 'Test Prompt',
    },
    maxIdx: 5,
    item: 'Test Item',
    entityId: '1',
  };

  it('renders the entity card with correct data', () => {
    render(<EntityCard {...mockProps} />);
    const { name, scientific_name, model, date, prompt,...rest } = mockProps.desc;

    expect(screen.getByTestId('entity-card')).toBeInTheDocument();
    expect(screen.getByTestId('entity-image')).toHaveAttribute('src', mockProps.img);
    expect(screen.getByTestId('entity-title')).toHaveTextContent(name);
    // footer;
    expect(screen.getByTestId('entity-card-footer')).toHaveTextContent(prompt);
    expect(screen.getByTestId('entity-card-footer')).toHaveTextContent(date);
    expect(screen.getByTestId('entity-card-footer')).toHaveTextContent(model);

    // details;
    const detailsGrid = screen.getByTestId('entity-details-grid');
        Object.values(rest).forEach((value) => {
            expect(detailsGrid.innerHTML).toContain(value);
        });
    });

  it('renders the image with alt text', () => {
    render(<EntityCard {...mockProps} />);
    expect(screen.getByTestId('entity-image')).toHaveAttribute('alt', mockProps.item);
  });
}); 