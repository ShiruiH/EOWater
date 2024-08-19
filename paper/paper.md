---
title: 'WaterWatcher: A Google Earth Engine-based efficient water monitoring tool'
tags:
  - Google Earth Engine
  - Python
  - Javascript
  - water monitoring
  - water resources management
authors:
  - name: Shirui Hao
    orcid: 0000-0000-0000-0000
    corresponding: true
    equal-contrib: true
    affiliation: 1 # (Multiple affiliations must be quoted)
  - name: Kilian Vos
    orcid: 0000-0002-9518-1582
    corresponding: true
    equal-contrib: true # (This is how you can denote equal contributions between multiple authors)
    affiliation: 2
  - name: Mustak Shaikh
    affiliation: 2
  - name: Rory Donnelly
    affiliation: 1
  - name: Azeem Khan
    affiliation: 2
affiliations:
 - name: NGIS
   index: 1
 - name: NSW Department of Climate Change, Energy, the Environment and Water
   index: 2
date: 06 August 2024
bibliography: paper.bib

# LETS ADD A FOOTER NOTE MENTIONING THAT BOTH S. Hao and K. Vos are first authors and have equally contributed.

# Optional fields if submitting to a AAS journal too, see this blog post:
# https://blog.joss.theoj.org/2018/12/a-new-collaboration-with-aas-publishing
# aas-doi: 10.3847/xxxxx <- update this with the DOI from AAS once you know it.
# aas-journal: Astrophysical Journal <- The name of the AAS journal.
---

# Summary

`WaterWatcher` is a Google-Earth-Engine-enabled package designed for historical and near real-time monitoring of waterbodies from publicly available Landsat and Sentinel-2 imagery. The package enables users to input a set of polygons representating the boundaries of waterbodies and it outputs a time-series of water surface area, including confidence interval, for each waterbody. The water surface area mapping algorithm is deployed in the cloud in a raster-only process that is highly efficient, scalable and uses optimally GEE's resources. State-of-the-art cloud masking (s2cloudless) is employed to maximise the temporal depth of the observations. In light of the growing gloabal challenge of sustainably managing water resources, this development contributes to help monitoring water resources over large spatio-temporal scales and support planners with low-cost reliable remote sensing data.

# Statement of need

Sustainable freshwater resources are critical in supporting communities, industry and environmental assets such as wetlands. Government agencies are tasked with planning for and managing water collection, storage and distribution, whilst ensuring these resources are shared equitably. To do so, accurate and continuous monitoring of water availability in natural and man-made reservoirs is paramount to inform sustainable water management strategies.

Publicly available Landsat and Sentinel-2 satellite imagery can be leveraged to provide historical and near real-time information on the state of water resources `@donchyts2022high`  ->  "Donchyts et al. (2022)". Many algoritms exist to map water pixels from multispectral satellite imagery, with software provided with publications often focused on global/continental applications. While these global applications are very impactful, they may not fit with operational requirements, such as providing specific boundaries for waterbodies, customising water index thresholds and selecting cloud mask probability. `WaterWatcher` provides a fully customisable operational workflow to extract water surface areas time-series for user-defined waterbodies in near real-time. The algorithm presented here, based on Python scripts using the GEE API, can be efficiently deployed to the cloud and scheduled for a low-cost operational setup. 

# Water surface area monitoring

Explain MNDWI index and add a figure with satellite image of a reservoir

# Main functionalities

## Water and Cloud masking

Explain s2cloudless cloud masking

## Raster-based processing

Explain creation of raster masks
Explain raster operations (sums and subtractions)

## Scheduling and Post-processing

Explain how to schedule to output in cloud buckets
Explain how to post-process from cloud buckets

## Example application in the Murray-Darling Basin

Show example for 1 S2 tile in Northern Basin (the one in the notebook)

# Conclusion

 




# Mathematics

Single dollars ($) are required for inline mathematics e.g. $f(x) = e^{\pi/x}$

Double dollars make self-standing equations:

$$\Theta(x) = \left\{\begin{array}{l}
0\textrm{ if } x < 0\cr
1\textrm{ else}
\end{array}\right.$$

You can also use plain \LaTeX for equations
\begin{equation}\label{eq:fourier}
\hat f(\omega) = \int_{-\infty}^{\infty} f(x) e^{i\omega x} dx
\end{equation}
and refer to \autoref{eq:fourier} from text.

# Citations

Citations to entries in paper.bib should be in
[rMarkdown](http://rmarkdown.rstudio.com/authoring_bibliographies_and_citations.html)
format.

If you want to cite a software repository URL (e.g. something on GitHub without a preferred
citation) then you can do it with the example BibTeX entry below for @fidgit.

For a quick reference, the following citation commands can be used:
- `@author:2001`  ->  "Author et al. (2001)"
- `[@author:2001]` -> "(Author et al., 2001)"
- `[@author1:2001; @author2:2001]` -> "(Author1 et al., 2001; Author2 et al., 2002)"

# Figures

Figures can be included like this:
![Caption for example figure.\label{fig:example}](figure.png)
and referenced from text using \autoref{fig:example}.

Figure sizes can be customized by adding an optional second parameter:
![Caption for example figure.](figure.png){ width=20% }

# Acknowledgements

We acknowledge contributions from Brigitta Sipocz, Syrtis Major, and Semyeong
Oh, and support from Kathryn Johnston during the genesis of this project.

# References