<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="0"
    width="0"
  >
    <defs>
      <filter
        v-for="variant in variants"
        :id="`ragged-edges-${variant}`"
        :key="variant"
      >
        <feTurbulence
          id="turbulence"
          type="fractalNoise"
          baseFrequency="0.01"
          numOctaves="4"
          result="main"
          :seed="variant"
        />
        <feDisplacementMap
          id="displacement"
          in="SourceGraphic"
          in2="main"
          result="main"
          scale="8"
        />
        <feGaussianBlur stdDeviation="1" />
        <feComponentTransfer result="main">
          <feFuncA
            type="gamma"
            amplitude="50"
            exponent="5"
          />
        </feComponentTransfer>
        <feComposite
          in="SourceGraphic"
          in2="main"
          operator="over"
        />
      </filter>
    </defs>
  </svg>
</template>

<script setup>
import { raggedEdgeVariations } from '@/utils/svgUtils'

const variants = Array.from({ length: raggedEdgeVariations }, (_, i) => i + 1)

if (document.adoptedStyleSheets) {
  // If adoptedStyleSheets is not supported it won't be enabled
  const styleSheet = new CSSStyleSheet()
  for (const variant of variants) {
    styleSheet.insertRule(`.ragged-edges-${variant} { filter: url(#ragged-edges-${variant})}`)
  }
  document.adoptedStyleSheets.push(styleSheet)
}
</script>
