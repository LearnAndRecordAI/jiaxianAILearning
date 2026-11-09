import assert from 'node:assert/strict'
import test from 'node:test'
import {selectCourseCover} from '../src/utils/playbackCover.mjs'

test('real playback frame wins over original thumbnails and topic placeholders', () => {
  assert.equal(selectCourseCover('course', 'server', {
    'course-frame-20261109': 'frame.jpg',
    'course-catalogue-20261102': 'thumbnail.jpg',
    course: 'old.jpg',
    'topic-server': 'generic.jpg',
  }), 'frame.jpg')
})

test('unavailable playback frames preserve source covers and existing fallbacks', () => {
  assert.equal(selectCourseCover('a', 'server', {'a-catalogue-20261102':'original.jpg',a:'old.jpg'}), 'original.jpg')
  assert.equal(selectCourseCover('a', 'server', {a:'source.jpg','topic-server':'generic.jpg'}), 'source.jpg')
  assert.equal(selectCourseCover('a', 'server', {'topic-server':'generic.jpg'}), 'generic.jpg')
  assert.equal(selectCourseCover('a', 'server', {}), undefined)
})
