#!/usr/bin/env python
 
from __future__ import with_statement
from PIL import Image
 
im = Image.open('data/images/stream.png') #relative path to file
 
#load the pixel info
pix = im.load()
 
#get a tuple of the x and y dimensions of the image
width, height = im.size
#width = 66
#height = 44
#open a file to write the pixel data
with open('data/images/480x360stream.png.csv', 'w+') as f:
  #f.write('R,G,B\n')
 
  #read the details of each pixel and write them to the file
  for x in range(width):
    for y in range(height):
      r = pix[x,y][0]
      g = pix[x,y][1]
      b = pix[x,y][2]
      f.write('{0},\n{1},\n{2},\n'.format(r,g,b))
 
