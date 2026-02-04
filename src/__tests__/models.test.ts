import { describe, it, expect } from 'vitest';
import { mapModel, getAllModels, CHAT_MODELS, IMAGE_MODELS } from '../models.js';

describe('mapModel', () => {
  it('should map chat model aliases correctly', () => {
    expect(mapModel('claude-haiku', 'chat')).toBe('claude-3-5-haiku-20241022');
    expect(mapModel('gpt-4o', 'chat')).toBe('gpt-4o');
  });

  it('should map image model aliases correctly', () => {
    expect(mapModel('dall-e-3', 'image')).toBe('dall-e-3');
    expect(mapModel('flux-pro', 'image')).toBe('black-forest-labs/flux-pro');
  });

  it('should return original model if not found', () => {
    expect(mapModel('unknown-model', 'chat')).toBe('unknown-model');
  });

  it('should default to chat category', () => {
    expect(mapModel('claude-haiku')).toBe('claude-3-5-haiku-20241022');
  });
});

describe('getAllModels', () => {
  it('should return all model categories', () => {
    const models = getAllModels();

    expect(models).toHaveProperty('chat');
    expect(models).toHaveProperty('image');
    expect(models).toHaveProperty('audio');
    expect(models).toHaveProperty('video');
  });

  it('should return arrays of model IDs', () => {
    const models = getAllModels();

    expect(Array.isArray(models.chat)).toBe(true);
    expect(Array.isArray(models.image)).toBe(true);
    expect(models.chat.length).toBe(Object.keys(CHAT_MODELS).length);
  });
});

describe('CHAT_MODELS', () => {
  it('should contain Claude models', () => {
    expect(CHAT_MODELS).toHaveProperty('claude-haiku');
    expect(CHAT_MODELS).toHaveProperty('claude-sonnet');
    expect(CHAT_MODELS).toHaveProperty('claude-opus');
  });

  it('should contain GPT models', () => {
    expect(CHAT_MODELS).toHaveProperty('gpt-4o');
    expect(CHAT_MODELS).toHaveProperty('gpt-4o-mini');
    expect(CHAT_MODELS).toHaveProperty('gpt-3.5-turbo');
  });
});

describe('IMAGE_MODELS', () => {
  it('should contain DALL-E models', () => {
    expect(IMAGE_MODELS).toHaveProperty('dall-e-3');
    expect(IMAGE_MODELS).toHaveProperty('dall-e-2');
  });

  it('should contain Flux models', () => {
    expect(IMAGE_MODELS).toHaveProperty('flux-pro');
    expect(IMAGE_MODELS).toHaveProperty('flux-schnell');
  });
});
