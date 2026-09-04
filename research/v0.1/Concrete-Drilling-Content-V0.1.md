---
title: Concrete Drilling Content V0.1
create_time: 2026-09-04
tags:
  - VisualJobSolver
  - ConcreteDrilling
source:
  - Official manufacturer documentation listed below
status: frozen
version: "0.1"
---

# Concrete Drilling

Start with the job, not the product.

This evidence snapshot supports ordinary concrete drilling with solid hammer drill bits. It explains tool choices and their limits. It does not design anchors, approve a drilling location or guarantee dust exposure compliance. The machine-readable baseline is `Concrete-Drilling-Rules-V0.1.json`; the explanations below must not be converted into additional automatic thresholds.

## What job are you trying to do?

Start with the task, confirmed material, required hole diameter, required hole depth, number of holes, and corded/cordless preference. For an anchor hole, obtain the dimensions and installation procedure from the selected anchor's current instructions. Do not calculate them from a screw's nominal size. [Hilti SafeSet][S17]

If the material or drilling requirements are unknown, verify them first. A complete set of six inputs still cannot establish what is behind the surface or whether cutting reinforcement is permitted. [Bosch material guidance][S03], [Hilti safety instructions][S10], [Hilti reinforcement guide][S18]

## Drill vs Hammer Drill vs Rotary Hammer

| Tool | Meaning in this guide | Evidence-based boundary |
|---|---|---|
| Drill / drill driver | Rotation without axial hammer action | Not the default for the concrete hammer-drilling systems researched here. This is not a claim that rotation-only drilling is physically impossible. |
| Hammer drill / combi drill | Rotation with mechanical axial percussion | Some models explicitly support concrete. Verify the exact tool, bit, mode and operating limits. |
| Rotary hammer | A hammer mechanism intended for tasks including concrete drilling, commonly with an SDS holder | A relevant candidate, but the tool's material, method and accessory capabilities still matter. |

Manufacturers and markets use names differently; a page title alone is insufficient to classify a tool. [Bosch drill guide][S01], [Makita FAQ][S02]

Bosch's CYL-3 guidance distinguishes concrete impact drilling from rotation-only work in more fragile materials. A compatible chuck and a material label therefore do not establish an approved rotation-only concrete system. [Bosch CYL-3][S03]

Makita's HP2010N hammer drill lists a 20 mm concrete capacity. That is one model's capacity, not a recommended diameter for every hammer drill and not proof of equal productivity to a rotary hammer. “Concrete = Rotary Hammer” would discard a documented capability. [Makita HP2010N][S14]

## What SDS actually means

SDS-Plus and SDS-Max describe accessory shank and tool-holder interfaces. They sit below the tool category, alongside the tool's operating modes; they are not two additional tool types.

Hilti uses TE-C for SDS-Plus and TE-Y for SDS-Max. Its TE-Y-BFH adapter demonstrates that manufacturer-supported conversions can exist. V0.1 uses native interface matching as its baseline; it does not automatically approve an adapter system or extend a tool's capacity because an accessory can be fitted. [Hilti adapter][S15]

## SDS-Plus vs SDS-Max

There is no supported universal diameter at which every job must switch from SDS-Plus to SDS-Max.

For example, Bosch lists optimum ranges of 14–25 mm for the SDS-Plus GBH 4-32 DFR and 18–32 mm for the SDS-Max GBH 5-40 DCE. Their overlap is a calculation from those two published ranges. It does not define a class-wide boundary. Compare the complete systems and the actual work rather than selecting from the interface name alone. [GBH 4-32 DFR][S07], [GBH 5-40 DCE][S08]

The labels “light,” “medium” and “heavier” below organise research examples. They do not establish hole-count, hole-depth or diameter bands.

## Maximum Capacity vs Optimum Range

**Just because a tool can drill a hole doesn't mean it's the right tool for the job.**

Keep each published field in its original context:

| Field | How to read it |
|---|---|
| Capacity / drilling range | A model-specific capability for a stated material and bit or method. |
| Optimum range | A manufacturer's preferred application range; being outside it is not automatically being outside capacity. |
| Maximum recommended capacity | Preserve this wording; do not rename it “optimum.” |
| Core or breakthrough capacity | A different accessory/method field, not a larger ordinary solid-bit limit. |

Hilti TE 2 lists a 4–14 mm optimum range and a 4–22 mm hammer-drilling range. DEWALT's cited manual instead labels its table “Maximum Recommended Capacities” and uses “masonry”; neither the field nor the material should be silently renamed. [Hilti TE 2][S04], [DEWALT manual][S11]

Hilti TE 60 documentation contains differently scoped website and manual ranges. Those observations remain separate in the JSON conflict register; V0.1 does not choose the largest value or merge regions and generations. [UK product page][S09], [generation 04 manual][S10]

## How to choose

**Task & Material → Drilling Method → Tool/Bit Capability → Optimum Range → Power & Workload → Recommendation & Limitations**

1. Confirm the task and material. Keep special core drilling and breakthrough-bit systems outside the ordinary-bit path.
2. Use confirmed hole dimensions. Anchor specifications must come from the selected anchor system.
3. Check the exact tool, bit, interface, mode and dust components against their own limits.
4. Use an optimum range to explain a choice. In this frozen baseline it does not automatically rank or eliminate candidates.
5. Apply the user's power preference only after technical checks. A cordless SDS-Max tool exists; cordless is not a synonym for low capability. [Milwaukee 2717-20][S13]
6. Discuss workload without inventing thresholds. Milwaukee's 2915-20 claim concerns up to 50 holes of 5/8 in × 3 in with its stated XC6.0 battery. It is not guaranteed output or a rule requiring a cord after 50 holes. [Milwaukee 2915-20][S12]
7. Show the supporting sources and remaining conditions. If evidence cannot support a deterministic answer, ask for the missing information or direct the user to verify the specific manufacturer's capability.

The JSON freezes seven GREEN validation rules, seven YELLOW explanations and six RED prohibited automatic judgements. Passing a check means only that the corresponding incompatibility was not established. It does not prove a complete job is safe or suitable.

## Bits and Accessories

A bit must match more than the holder: check its material, operating mode, diameter and working length. Total length includes parts that do not provide usable hole depth. Do not subtract an invented standard shank length or add a universal depth allowance. [Bosch CYL-3][S03], [Hilti TE-CX][S16]

Dust accessories can impose their own limits on bit length and hole depth. A longer bit does not automatically produce a deeper usable system. [GDE instructions][N04]

A bit advertised for reinforced concrete is not permission to cut reinforcement, prestressing or an unidentified metal object. An attachment's metal-drilling prohibition also remains in force. [Hilti reinforcement guide][S18], [GDE instructions][N04]

## Dust Extraction

Match the collection attachment to the tool, drilling diameter, bit length, material and required depth. Then verify its filter, dust container, power or external extractor connection and installation instructions.

HEPA filter efficiency, an extractor's M-class designation, capture at the hole and legal exposure compliance are different claims. A filter label does not prove that the full job meets local exposure requirements. [Bosch Dust Control brochure][N13]

The Hilti ROW product page uses both M-Class and HEPA wording. Its precise supplied filter configuration remains unresolved here. No compliance conclusion is drawn from either label. [Hilti TE DRS-4/6][N07]

## Complete Job Kit

A drilling kit needs a verified tool, the correct bit, the prescribed dust components, suitable power, and the handles/depth-control equipment required by the instructions. Include eye, hearing and other protection required for the tool and site; respiratory protection must follow the actual exposure assessment and local requirements. For anchoring, add only the fastener, cleaning and installation components required by that specific system. [DEWALT instructions][S11], [Hilti instructions][S10], [SafeSet][S17]

The following are research assemblies, not assumed customer jobs or claims about a single retail box.

### Case A — Light Concrete Drilling

**Bosch GBH 18V-22 → EXPERT SDS plus-7X 2608900072 → GDE 18V-12.**

The official tool page links the dust unit and identifies another package containing GBA 18V 4.0Ah with GAL 18V-40. Separate package contents establish component compatibility, not an all-in-one bundle. [Tool and packages][N01], [dust unit][N03]

The selected bit text lists 6 mm diameter, 100 mm working length and 165 mm total length. The page's image metadata differs, so these observations are retained but its effective automatic geometry is null pending confirmation. This is a documented tool–bit family–dust connection, not an unconditional SKU recommendation. [Selected bit][N02]

The dust manual limits this attachment to 4–12 mm diameters, 165 mm maximum bit length and 100 mm maximum drilling depth, with a battery greater than 3.0 Ah. These are attachment-specific values. Use the prescribed intact filter and dust box; no external vacuum is part of this integrated assembly. [GDE instructions][N04]

### Case B — Medium Anchor Hole Drilling

**Hilti TE 6-22 (05) → TE-CX 10/17 MP16 #2022035 → TE DRS-4/6 (01) ROW #2268002.**

Tool-to-bit-family and tool-to-dust connections are documented. An official UK set also establishes B 22-85 battery and C 4-22 charger compatibility; the extractor's internal fan uses the tool battery. No external vacuum is required. [Tool][N05], [bit][N06], [dust module][N07], [manual][N08], [power set][N09]

This third sample remains conditional. The retrieved UK bit page does not establish a reliable selected-SKU dimension tuple. The generic dust page lists 110 mm depth, while the manual gives 80 mm for TE 6-22 with TE-CX XX/17; they are not interchangeable fields. Exact geometry and ROW filter configuration need confirmation. No anchor diameter, embedment or cleaning approval is implied. [Dust page][N07], [manual][N08]

### Case C — Heavier Concrete Drilling

**Bosch GBH 5-40 DCE → EXPERT SDS max-8X 2608900228 → GDE 68 → GAS 35 M AFC.**

The selected bit is 20 mm diameter, with 200 mm working length and 320 mm total length. Its native interface and diameter match the published ordinary-bit range for this hammer; this is an intersection of specifications, not a manufacturer-issued certification of each SKU combination. [Hammer][S08], [bit][N10]

GDE 68 supports drilling tools through its wall-mounted collection arrangement. Both it and GAS 35 M AFC identify Click & Clean compatibility. The UK 110V vacuum variant 06019C3170 includes hose/adapter 2608000566, PES filter 2607432034 and disposal bag 2607432043; it matches the chosen hammer's voltage designation. This does not approve a particular transformer, circuit or vacuum pass-through socket connection. [GDE 68][N11], [vacuum and variants][N12]

The wall seal depends on suction. Verify positioning and the manufacturer's installation instructions on the actual surface. No attachment maximum depth was established, so the bit's 200 mm working length is not a 200 mm whole-system depth guarantee. The GDE 68 opening capacity does not enlarge the hammer's own drilling range. [GDE 68][N11], [Dust Control brochure][N13]

## How-to: before and during drilling

This is an orientation checklist for an already verified ordinary-drilling setup, not a substitute for its manuals.

1. Verify the material, hole requirements and drilling location. Check hidden services and the back of through-holes. Resolve structural or reinforcement questions before drilling. [Hilti instructions][S10], [reinforcement guide][S18]
2. Isolate power as the tool's instructions require before changing bits or assembling accessories. Fit and check the correct bit, auxiliary handle and dust components. [DEWALT instructions][S11]
3. Set the depth control using the chosen system's procedure. On GDE 18V-12, align its guide as instructed and inspect the filter and container before operation. [GDE instructions][N04]
4. Use the specified drilling mode and maintain control with the required grips. Do not force progress with excessive pressure. Stop at jamming or an unexpected obstruction; verify its cause before proceeding. [DEWALT instructions][S11], [Hilti instructions][S10]
5. Complete hole cleaning and installation according to the chosen anchor's current instructions. Dust collection during drilling does not establish that an anchor hole is ready for installation. [SafeSet][S17]

## Common Selection Mistakes

- Treating SDS-Plus or SDS-Max as a universal diameter band.
- Calling maximum capacity an optimum range.
- Applying a core-drilling number to an ordinary solid bit.
- Reading total bit length as usable hole depth.
- Ignoring the tighter limits imposed by a dust attachment.
- Inferring runtime or a corded/cordless cutoff from hole count.
- Treating a filter label as approval of the entire job.
- Treating reinforced-concrete capability as permission to cut steel.

The evidence for these distinctions is recorded above and in CDR-001 through CDR-020 of the JSON baseline.

## Safety Notes

A tool recommendation does not clear a drilling location, determine structural loads or identify concealed hazards. Stop when an unexpected obstruction, reinforcement or possible prestressing is encountered and obtain the appropriate verification. The historical Hilti guide is used only for this risk boundary, not as current structural design authority. [Hilti instructions][S10], [reinforcement guide][S18]

Follow the actual tool and attachment manuals, including grip, power isolation and filter-maintenance instructions. Do not use drill-bit marketing to override an attachment's material restrictions. [DEWALT instructions][S11], [GDE instructions][N04]

This content makes no OSHA or other jurisdiction-wide compliance claim. The original OSHA entry was only partially accessible and is retained as background, not executable evidence. [OSHA entry][S19]

## Sources

Access date for all entries: **2026-09-04**. N01–N13 are the **13 newly admitted official sources**; S01–S19 are retained from the original report. The JSON stores the relevant statements, field scopes and conflict records. An unconfirmed publication date remains null.

Product-family compatibility and numerical intersections are identified as such; they are not independent performance testing. PDF text was reviewed, but unresolved visual-table checks are not claimed complete. No conflicting numeric field has been selected as a universal answer.

| ID | Official document | Scope / version |
|---|---|---|
| S01 | [Bosch DIY — Types of drills][S01] | UK; tool taxonomy |
| S02 | [Makita — Frequently asked questions][S02] | Canada; application FAQ |
| S03 | [Bosch — CYL-3 Drill Bit][S03] | UK; bit family and mode guidance |
| S04 | [Hilti — TE 2 Rotary hammer][S04] | UK; TE 2 |
| S05 | [Hilti — TE 30-AVR Rotary hammer][S05] | UK; TE 30-AVR, selected 110V package |
| S06 | [Bosch — PRO GBH 2-28 F][S06] | UK; GBH 2-28 F, 110V |
| S07 | [Bosch — PRO GBH 4-32 DFR][S07] | UK; GBH 4-32 DFR, voltage fields differ |
| S08 | [Bosch — PRO GBH 5-40 DCE][S08] | UK; GBH 5-40 DCE, 110V |
| S09 | [Hilti — TE 60-ATC-AVR Rotary hammer][S09] | UK; TE 60 generation 04, differently scoped fields |
| S10 | [Hilti — Operating Instruction TE 60 (04), 2134964][S10] | Australia-hosted generation 04 manual, 230V basis; 2024-07-10 |
| S11 | [DEWALT — DCH253/DCH273 Instruction Manual][S11] | North America; DCH253/DCH273; original table visual check incomplete |
| S12 | [Milwaukee — 2915-20][S12] | USA; 2915-20 with specified battery |
| S13 | [Milwaukee — 2717-20][S13] | USA; 2717-20 |
| S14 | [Makita — HP2010N][S14] | New Zealand; HP2010N, 230V |
| S15 | [Hilti — Spindle TE-Y-BFH #263359][S15] | USA; specified adapter |
| S16 | [Hilti — TE-CX metric hammer bit][S16] | USA; metric bit family |
| S17 | [Hilti — SafeSet and Anchor Installation][S17] | Singapore; anchor-system method explanation |
| S18 | [Hilti — Post-Installed Reinforcing Bar Guide][S18] | North America; August 2015 historical guide |
| S19 | [OSHA — 29 CFR 1926.1153][S19] | USA; index only, no current implementation claim |
| N01 | [Bosch — PRO GBH 18V-22][N01] | UK; model and individually identified package variants |
| N02 | [Bosch — EXPERT SDS plus-7X Hammer Drill Bit, 2608900072][N02] | UK; selected SKU text, separate from image metadata |
| N03 | [Bosch — PRO GDE 18V-12 Integrated Dust Extractor][N03] | UK; sales order 1600A028H6 |
| N04 | [Bosch — GDE 18V-12 / GDE 12 Original Instructions, 1 609 92A B73][N04] | UK-linked multilingual manual; GDE 18V-12 with listed hammers; 2025-01 |
| N05 | [Hilti — Nuron TE 6-22 Cordless rotary hammer, #2253058][N05] | UK; TE 6-22 (05) |
| N06 | [Hilti — TE-CX 10/17 MP16, #2022035][N06] | UK; selected item identity verified, selected geometry unverified |
| N07 | [Hilti — TE DRS 4/6 Dust removal system, #2268002][N07] | UK; TE DRS-4/6 (01) ROW |
| N08 | [Hilti — Operating Instruction TE DRS-4/6, 2290878][N08] | UK-linked manual; TE 6-22 (05) / TE 4-22 (03) |
| N09 | [Hilti — TE 6-22 & SID 4-22 Drill & Fasten – Standard Set, #2486910][N09] | UK; compatibility evidence only, not a required multi-tool purchase |
| N10 | [Bosch — EXPERT SDS max-8X Hammer Drill Bit, 2608900228][N10] | UK; specific SKU row |
| N11 | [Bosch — PRO GDE 68 System Accessories][N11] | UK; order 1600A001G7 |
| N12 | [Bosch — PRO GAS 35 M AFC Corded Dust Extractor][N12] | UK; choose 06019C3170 110V variant, not selected 240V variant |
| N13 | [Bosch — Dust Control brochure][N13] | UK; GDE wall attachment and dust classification explanation |

[S01]: https://www.bosch-diy.com/gb/en/all-about-diy/types-of-drills
[S02]: https://www.makita.ca/index2new.php?event=faq-frequently-asked-questions
[S03]: https://www.bosch-professional.com/gb/en/cyl-3-concrete-drill-bits-2868161-ocs-ac/
[S04]: https://www.hilti.co.uk/c/CLS_POWER_TOOLS_7125/CLS_ROTARY_HAMMERS_7125/r3682
[S05]: https://www.hilti.co.uk/c/CLS_POWER_TOOLS_7125/CLS_ROTARY_HAMMERS_7125/r6848759
[S06]: https://www.bosch-professional.com/gb/en/products/gbh-2-28-f-0611267661
[S07]: https://www.bosch-professional.com/gb/en/products/gbh-4-32-dfr-0611332171
[S08]: https://www.bosch-professional.com/gb/en/products/gbh-5-40-dce-0611264060
[S09]: https://www.hilti.co.uk/c/CLS_POWER_TOOLS_7125/CLS_ROTARY_HAMMERS_7125/r5731031
[S10]: https://www.hilti.com.au/medias/sys_master/documents/h0f/h32/10131928743966/Operating-Instruction-TE-60-04-Operating-Instruction-PUB-5278010-000.pdf
[S11]: https://www.dewalt.com/GLOBALBOM/QU/DCH273B/20/Instruction_Manual/EN/NA516950_DCH253_DCH273_T1_NA.pdf
[S12]: https://www.milwaukeetool.com/products/details/m18-fuel-1-1-8-sds-plus-rotary-hammer-w-one-key/2915-20
[S13]: https://www.milwaukeetool.com/products/details/m18-fuel-1-9-16-sds-max-rotary-hammer/2717-20
[S14]: https://www.makita.co.nz/products/model/HP2010N
[S15]: https://www.hilti.com/c/CLS_POWER_TOOLS_7125/CLS_TOOLS_7125/CLS_ACC_ROTARY_HAMMERS_7125/263359
[S16]: https://www.hilti.com/c/CLS_POWER_TOOL_INSERT_7126/CLS_CONCRETE_MASONRY_DRILL_BITS_7126/r4429
[S17]: https://www.hilti.com.sg/content/hilti/A2/SG/en/products/bu-anchors/safeset-and-anchor-installations.html
[S18]: https://files-ask.hilti.com/original/ci/cikbnwqsf1.pdf
[S19]: https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1153
[N01]: https://www.bosch-professional.com/gb/en/products/gbh-18v-22-0611924000
[N02]: https://www.bosch-professional.com/gb/en/expert-sds-plus-7x-hammer-drill-bit-2867204-ocs-ac/?sku=2608900072
[N03]: https://www.bosch-professional.com/gb/en/products/gde-12-gde-18v-12-1600A028H6
[N04]: https://www.bosch-professional.com/binary/manualsmedia/o554384v21_160992AB73_202501.pdf
[N05]: https://www.hilti.co.uk/c/CLS_POWER_TOOLS_7125/CLS_ROTARY_HAMMERS_7125/r13250305?itemCode=2253058
[N06]: https://www.hilti.co.uk/c/CLS_POWER_TOOL_INSERT_7126/CLS_CONCRETE_MASONRY_DRILL_BITS_7126/r4429?CHD_DIAMETER_DEV=10+mm&CHD_WORKING_LENGTH_DEV=100+mm&combo_content=7215ee9c7d9dc229d2921a40e899ec5f&itemCode=2022035&salespackquantity=16
[N07]: https://www.hilti.co.uk/c/CLS_DUST_WATER_MANAGEMENT/CLS_ON_BOARD_DUST_REMOVAL_SYS/r14311843?itemCode=2268002
[N08]: https://productdata.hilti.com/APQ_HC_RAW/PUB_5664762_000.pdf
[N09]: https://www.hilti.co.uk/c/CLS_POWER_TOOLS_7125/CLS_POWER_TOOLS_COMBO_KITS_7125/r25115169
[N10]: https://www.bosch-professional.com/gb/en/expert-sds-max-8x-hammer-drill-bit-2867203-ocs-ac/
[N11]: https://www.bosch-professional.com/gb/en/products/gde-68-1600A001G7
[N12]: https://www.bosch-professional.com/gb/en/products/gas-35-m-afc-06019C3160
[N13]: https://www.bosch-professional.com/gb/media/service_relaunch/downloads/kataloge/51577-bosch-dust-control-brochure.pdf
