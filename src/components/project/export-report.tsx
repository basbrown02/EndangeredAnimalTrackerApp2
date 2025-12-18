"use client";

import { forwardRef } from "react";
import { Species } from "@/data/species";
import { EaiResult, MathInputs } from "@/lib/calculations/eai";

type Props = {
  species: Species;
  result: EaiResult;
  inputs: MathInputs;
  narrative: {
    risks: string;
    climateImpact: string;
    actions: string;
    scratchpadNotes?: string;
  };
  studentName?: string;
  projectionData: { year: number; population: number }[];
  extinctionYear: number | null;
};

// Use standard hex colors for PDF compatibility
const colors = {
  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },
  emerald: {
    50: "#ecfdf5",
    100: "#d1fae5",
    400: "#34d399",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
  },
  rose: {
    50: "#fff1f2",
    100: "#ffe4e6",
    200: "#fecdd3",
    500: "#f43f5e",
    600: "#e11d48",
    700: "#be123c",
  },
  amber: {
    50: "#fffbeb",
    100: "#fef3c7",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
  },
  yellow: {
    50: "#fefce8",
    500: "#eab308",
  },
  violet: {
    50: "#f5f3ff",
    500: "#8b5cf6",
  },
  orange: {
    50: "#fff7ed",
    600: "#ea580c",
  },
  sky: {
    50: "#f0f9ff",
    500: "#0ea5e9",
  },
  teal: {
    500: "#14b8a6",
  },
};

export const ExportReport = forwardRef<HTMLDivElement, Props>(
  ({ species, result, inputs, narrative, studentName, projectionData, extinctionYear }, ref) => {
    const currentYear = new Date().getFullYear();
    const yearsToExtinction = extinctionYear ? extinctionYear - currentYear : null;

    const getScoreLabel = (score: number) => {
      if (score >= 751) return { label: "Critical", color: colors.rose[500], bg: colors.rose[50] };
      if (score >= 501) return { label: "High Risk", color: colors.amber[500], bg: colors.amber[50] };
      if (score >= 251) return { label: "Moderate", color: colors.yellow[500], bg: colors.yellow[50] };
      return { label: "Stable", color: colors.emerald[500], bg: colors.emerald[50] };
    };

    const scoreInfo = getScoreLabel(result.score);

    return (
      <div 
        ref={ref} 
        style={{ 
          backgroundColor: "#ffffff", 
          color: colors.slate[800],
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: "14px",
          lineHeight: "1.5"
        }}
      >
        {/* Cover Page */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center", 
          padding: "48px", 
          textAlign: "center",
          minHeight: "600px"
        }}>
          <div style={{ fontSize: "96px", marginBottom: "32px" }}>{species.emoji}</div>
          
          <h1 style={{ 
            fontSize: "48px", 
            fontWeight: "900", 
            color: colors.slate[900],
            marginBottom: "8px"
          }}>
            {species.name}
          </h1>
          <p style={{ 
            fontSize: "20px", 
            fontStyle: "italic", 
            color: colors.slate[500],
            marginBottom: "32px"
          }}>{species.scientificName}</p>
          
          <div style={{ 
            height: "4px", 
            width: "128px", 
            background: `linear-gradient(to right, ${colors.emerald[400]}, ${colors.teal[500]})`,
            borderRadius: "2px",
            marginBottom: "48px"
          }} />
          
          <h2 style={{ 
            fontSize: "24px", 
            fontWeight: "700", 
            color: colors.emerald[600],
            marginBottom: "8px"
          }}>
            Endangered Animal Index Report
          </h2>
          <p style={{ fontSize: "18px", color: colors.slate[600] }}>A Conservation Analysis Study</p>
          
          <div style={{ 
            marginTop: "64px", 
            borderRadius: "16px", 
            border: `2px solid ${colors.slate[200]}`,
            backgroundColor: colors.slate[50],
            padding: "24px"
          }}>
            <p style={{ 
              fontSize: "12px", 
              fontWeight: "500", 
              textTransform: "uppercase", 
              letterSpacing: "0.1em",
              color: colors.slate[400]
            }}>Prepared by</p>
            <p style={{ 
              marginTop: "4px", 
              fontSize: "24px", 
              fontWeight: "700", 
              color: colors.slate[700]
            }}>{studentName || "Eco Detective"}</p>
            <p style={{ 
              marginTop: "16px", 
              fontSize: "14px", 
              color: colors.slate[500]
            }}>
              {new Date().toLocaleDateString("en-US", { 
                year: "numeric", 
                month: "long", 
                day: "numeric" 
              })}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ 
          borderBottom: `2px dashed ${colors.slate[200]}`, 
          margin: "32px 0" 
        }} />

        {/* Executive Summary */}
        <div style={{ padding: "48px" }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "12px",
            borderBottom: `2px solid ${colors.emerald[500]}`,
            paddingBottom: "16px",
            marginBottom: "32px"
          }}>
            <div style={{ 
              width: "40px", 
              height: "40px", 
              borderRadius: "50%", 
              backgroundColor: colors.emerald[500],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              color: "#ffffff"
            }}>
              📊
            </div>
            <h2 style={{ fontSize: "30px", fontWeight: "700", color: colors.slate[800] }}>Executive Summary</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "32px" }}>
            {/* EAI Score Card */}
            <div 
              style={{ 
                borderRadius: "16px", 
                border: `2px solid ${scoreInfo.color}`,
                backgroundColor: scoreInfo.bg,
                padding: "24px",
                textAlign: "center"
              }}
            >
              <p style={{ 
                fontSize: "12px", 
                fontWeight: "500", 
                textTransform: "uppercase", 
                letterSpacing: "0.1em",
                color: colors.slate[500]
              }}>EAI Score</p>
              <p style={{ 
                margin: "8px 0", 
                fontFamily: "monospace",
                fontSize: "48px", 
                fontWeight: "900", 
                color: scoreInfo.color
              }}>
                {result.score}
              </p>
              <p style={{ fontWeight: "600", color: scoreInfo.color }}>{scoreInfo.label}</p>
            </div>

            {/* Tipping Point Card */}
            <div style={{ 
              borderRadius: "16px", 
              border: `2px solid ${colors.slate[200]}`,
              backgroundColor: colors.slate[50],
              padding: "24px",
              textAlign: "center"
            }}>
              <p style={{ 
                fontSize: "12px", 
                fontWeight: "500", 
                textTransform: "uppercase", 
                letterSpacing: "0.1em",
                color: colors.slate[500]
              }}>Tipping Point</p>
              <p style={{ 
                margin: "8px 0", 
                fontSize: "30px", 
                fontWeight: "900", 
                color: colors.slate[800]
              }}>
                {yearsToExtinction ? `${yearsToExtinction} yrs` : "100+ yrs"}
              </p>
              <p style={{ fontSize: "14px", fontWeight: "500", color: colors.slate[600] }}>{result.tippingPointLabel}</p>
            </div>

            {/* Population Card */}
            <div style={{ 
              borderRadius: "16px", 
              border: `2px solid ${colors.slate[200]}`,
              backgroundColor: colors.slate[50],
              padding: "24px",
              textAlign: "center"
            }}>
              <p style={{ 
                fontSize: "12px", 
                fontWeight: "500", 
                textTransform: "uppercase", 
                letterSpacing: "0.1em",
                color: colors.slate[500]
              }}>Current Population</p>
              <p style={{ 
                margin: "8px 0", 
                fontSize: "30px", 
                fontWeight: "900", 
                color: colors.slate[800]
              }}>
                {inputs.population.toLocaleString()}
              </p>
              <p style={{ fontSize: "14px", fontWeight: "500", color: colors.slate[600] }}>Individuals remaining</p>
            </div>
          </div>

          {/* Key Findings */}
          <div style={{ 
            borderRadius: "16px", 
            background: `linear-gradient(135deg, ${colors.emerald[50]}, ${colors.teal[500]}20)`,
            padding: "24px"
          }}>
            <h3 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "700", color: colors.emerald[700] }}>Key Findings</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ 
                  width: "32px", 
                  height: "32px", 
                  borderRadius: "50%", 
                  backgroundColor: colors.emerald[500],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  color: "#ffffff",
                  flexShrink: 0
                }}>📈</div>
                <div>
                  <p style={{ fontWeight: "600", color: colors.slate[700] }}>Birth Rate</p>
                  <p style={{ fontSize: "14px", color: colors.slate[600] }}>{result.annualBirthRate.toFixed(2)}% per year</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ 
                  width: "32px", 
                  height: "32px", 
                  borderRadius: "50%", 
                  backgroundColor: colors.rose[500],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  color: "#ffffff",
                  flexShrink: 0
                }}>📉</div>
                <div>
                  <p style={{ fontWeight: "600", color: colors.slate[700] }}>Decline Rate</p>
                  <p style={{ fontSize: "14px", color: colors.slate[600] }}>{result.annualDeclineRate.toFixed(2)}% per year</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ 
                  width: "32px", 
                  height: "32px", 
                  borderRadius: "50%", 
                  backgroundColor: colors.violet[500],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  color: "#ffffff",
                  flexShrink: 0
                }}>🦎</div>
                <div>
                  <p style={{ fontWeight: "600", color: colors.slate[700] }}>Female Population</p>
                  <p style={{ fontSize: "14px", color: colors.slate[600] }}>{inputs.femalePopulation.toLocaleString()} individuals</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ 
                  width: "32px", 
                  height: "32px", 
                  borderRadius: "50%", 
                  backgroundColor: colors.amber[500],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  color: "#ffffff",
                  flexShrink: 0
                }}>⏳</div>
                <div>
                  <p style={{ fontWeight: "600", color: colors.slate[700] }}>Average Lifespan</p>
                  <p style={{ fontSize: "14px", color: colors.slate[600] }}>{inputs.lifespan} years</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ 
          borderBottom: `2px dashed ${colors.slate[200]}`, 
          margin: "32px 0" 
        }} />

        {/* Population Projection */}
        <div style={{ padding: "48px" }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "12px",
            borderBottom: `2px solid ${colors.rose[500]}`,
            paddingBottom: "16px",
            marginBottom: "32px"
          }}>
            <div style={{ 
              width: "40px", 
              height: "40px", 
              borderRadius: "50%", 
              backgroundColor: colors.rose[500],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              color: "#ffffff"
            }}>
              📉
            </div>
            <h2 style={{ fontSize: "30px", fontWeight: "700", color: colors.slate[800] }}>Population Projection</h2>
          </div>

          <p style={{ marginBottom: "24px", color: colors.slate[600] }}>
            Based on the current birth rate of <strong>{result.annualBirthRate.toFixed(2)}%</strong> and 
            decline rate of <strong>{result.annualDeclineRate.toFixed(2)}%</strong>, this projection shows 
            the estimated population trajectory over the next 50 years.
          </p>

          {/* Projection Table */}
          <div style={{ 
            marginBottom: "32px", 
            borderRadius: "12px", 
            border: `1px solid ${colors.slate[200]}`,
            overflow: "hidden"
          }}>
            <table style={{ width: "100%", fontSize: "14px", borderCollapse: "collapse" }}>
              <thead style={{ backgroundColor: colors.slate[100] }}>
                <tr>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: "600", color: colors.slate[700] }}>Year</th>
                  <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: "600", color: colors.slate[700] }}>Projected Population</th>
                  <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: "600", color: colors.slate[700] }}>Change from Today</th>
                </tr>
              </thead>
              <tbody>
                {[0, 10, 20, 30, 40, 50].map((yearOffset) => {
                  const dataPoint = projectionData[yearOffset];
                  if (!dataPoint) return null;
                  const changePercent = ((dataPoint.population - inputs.population) / inputs.population * 100).toFixed(1);
                  const isNegative = dataPoint.population < inputs.population;
                  return (
                    <tr key={yearOffset} style={{ borderTop: `1px solid ${colors.slate[100]}` }}>
                      <td style={{ padding: "12px 16px", fontWeight: "500", color: colors.slate[700] }}>{dataPoint.year}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right", fontFamily: "monospace", color: colors.slate[800] }}>
                        {dataPoint.population.toLocaleString()}
                      </td>
                      <td style={{ 
                        padding: "12px 16px", 
                        textAlign: "right", 
                        fontWeight: "600",
                        color: isNegative ? colors.rose[600] : colors.emerald[600]
                      }}>
                        {isNegative ? "" : "+"}{changePercent}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {extinctionYear && (
            <div style={{ 
              borderRadius: "12px", 
              border: `2px solid ${colors.rose[200]}`,
              backgroundColor: colors.rose[50],
              padding: "24px"
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                <div style={{ 
                  width: "48px", 
                  height: "48px", 
                  borderRadius: "50%", 
                  backgroundColor: colors.rose[500],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  color: "#ffffff",
                  flexShrink: 0
                }}>
                  ⚠️
                </div>
                <div>
                  <h3 style={{ fontSize: "20px", fontWeight: "700", color: colors.rose[700] }}>Critical Warning</h3>
                  <p style={{ marginTop: "8px", color: colors.slate[700] }}>
                    At current rates, the {species.name} population is projected to reach 
                    <strong style={{ color: colors.rose[600] }}> functional extinction (under 100 individuals)</strong> by 
                    the year <strong style={{ color: colors.rose[600] }}>{extinctionYear}</strong> — 
                    that&apos;s only <strong>{yearsToExtinction} years</strong> from now.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ 
          borderBottom: `2px dashed ${colors.slate[200]}`, 
          margin: "32px 0" 
        }} />

        {/* Research Data */}
        <div style={{ padding: "48px" }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "12px",
            borderBottom: `2px solid ${colors.violet[500]}`,
            paddingBottom: "16px",
            marginBottom: "32px"
          }}>
            <div style={{ 
              width: "40px", 
              height: "40px", 
              borderRadius: "50%", 
              backgroundColor: colors.violet[500],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              color: "#ffffff"
            }}>
              🔬
            </div>
            <h2 style={{ fontSize: "30px", fontWeight: "700", color: colors.slate[800] }}>Research Data</h2>
          </div>

          <p style={{ marginBottom: "24px", color: colors.slate[600] }}>
            The following data was collected and used to calculate the Endangered Animal Index score 
            for the {species.name}.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }}>
            {/* Population Metrics */}
            <div style={{ 
              borderRadius: "12px", 
              border: `1px solid ${colors.slate[200]}`,
              padding: "24px"
            }}>
              <h3 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "700", color: colors.slate[700] }}>Population Metrics</h3>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${colors.slate[100]}`, padding: "8px 0" }}>
                  <span style={{ color: colors.slate[600] }}>Total Population</span>
                  <span style={{ fontWeight: "600", color: colors.slate[800] }}>{inputs.population.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${colors.slate[100]}`, padding: "8px 0" }}>
                  <span style={{ color: colors.slate[600] }}>Female Population</span>
                  <span style={{ fontWeight: "600", color: colors.slate[800] }}>{inputs.femalePopulation.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                  <span style={{ color: colors.slate[600] }}>Female Ratio</span>
                  <span style={{ fontWeight: "600", color: colors.slate[800] }}>
                    {((inputs.femalePopulation / inputs.population) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Reproduction Data */}
            <div style={{ 
              borderRadius: "12px", 
              border: `1px solid ${colors.slate[200]}`,
              padding: "24px"
            }}>
              <h3 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "700", color: colors.slate[700] }}>Reproduction Data</h3>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${colors.slate[100]}`, padding: "8px 0" }}>
                  <span style={{ color: colors.slate[600] }}>Births per Cycle</span>
                  <span style={{ fontWeight: "600", color: colors.slate[800] }}>{inputs.birthsPerCycle}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${colors.slate[100]}`, padding: "8px 0" }}>
                  <span style={{ color: colors.slate[600] }}>Birth Cycle (years)</span>
                  <span style={{ fontWeight: "600", color: colors.slate[800] }}>{inputs.birthCycleYears}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                  <span style={{ color: colors.slate[600] }}>Age at First Birth</span>
                  <span style={{ fontWeight: "600", color: colors.slate[800] }}>{inputs.ageAtFirstBirth} years</span>
                </div>
              </div>
            </div>

            {/* Life History */}
            <div style={{ 
              borderRadius: "12px", 
              border: `1px solid ${colors.slate[200]}`,
              padding: "24px"
            }}>
              <h3 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "700", color: colors.slate[700] }}>Life History</h3>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${colors.slate[100]}`, padding: "8px 0" }}>
                  <span style={{ color: colors.slate[600] }}>Average Lifespan</span>
                  <span style={{ fontWeight: "600", color: colors.slate[800] }}>{inputs.lifespan} years</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${colors.slate[100]}`, padding: "8px 0" }}>
                  <span style={{ color: colors.slate[600] }}>Reproductive Years</span>
                  <span style={{ fontWeight: "600", color: colors.slate[800] }}>
                    {inputs.lifespan - inputs.ageAtFirstBirth} years
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                  <span style={{ color: colors.slate[600] }}>Lifetime Offspring/Female</span>
                  <span style={{ fontWeight: "600", color: colors.slate[800] }}>{result.lifetimeBabiesPerFemale.toFixed(1)}</span>
                </div>
              </div>
            </div>

            {/* Decline Factors */}
            <div style={{ 
              borderRadius: "12px", 
              border: `1px solid ${colors.slate[200]}`,
              padding: "24px"
            }}>
              <h3 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "700", color: colors.slate[700] }}>Decline Factors</h3>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${colors.slate[100]}`, padding: "8px 0" }}>
                  <span style={{ color: colors.slate[600] }}>Annual Decline Rate</span>
                  <span style={{ fontWeight: "600", color: colors.rose[600] }}>{inputs.declineRate}%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                  <span style={{ color: colors.slate[600] }}>Net Population Change</span>
                  <span style={{ 
                    fontWeight: "600",
                    color: result.annualBirthRate > result.annualDeclineRate ? colors.emerald[600] : colors.rose[600]
                  }}>
                    {(result.annualBirthRate - result.annualDeclineRate).toFixed(2)}%/year
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ 
          borderBottom: `2px dashed ${colors.slate[200]}`, 
          margin: "32px 0" 
        }} />

        {/* Analysis & Discussion */}
        <div style={{ padding: "48px" }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "12px",
            borderBottom: `2px solid ${colors.amber[500]}`,
            paddingBottom: "16px",
            marginBottom: "32px"
          }}>
            <div style={{ 
              width: "40px", 
              height: "40px", 
              borderRadius: "50%", 
              backgroundColor: colors.amber[500],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              color: "#ffffff"
            }}>
              💡
            </div>
            <h2 style={{ fontSize: "30px", fontWeight: "700", color: colors.slate[800] }}>Analysis & Discussion</h2>
          </div>

          {/* Risk Factors */}
          {narrative.risks && (
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ 
                marginBottom: "12px", 
                display: "flex", 
                alignItems: "center", 
                gap: "8px",
                fontSize: "20px", 
                fontWeight: "700", 
                color: colors.slate[700]
              }}>
                <span style={{ 
                  width: "32px", 
                  height: "32px", 
                  borderRadius: "50%", 
                  backgroundColor: colors.rose[100],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: colors.rose[600]
                }}>⚠️</span>
                Risk Factors
              </h3>
              <div style={{ 
                borderRadius: "12px", 
                backgroundColor: colors.rose[50],
                padding: "24px"
              }}>
                <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.7", color: colors.slate[700] }}>{narrative.risks}</p>
              </div>
            </div>
          )}

          {/* Climate Impact */}
          {narrative.climateImpact && (
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ 
                marginBottom: "12px", 
                display: "flex", 
                alignItems: "center", 
                gap: "8px",
                fontSize: "20px", 
                fontWeight: "700", 
                color: colors.slate[700]
              }}>
                <span style={{ 
                  width: "32px", 
                  height: "32px", 
                  borderRadius: "50%", 
                  backgroundColor: colors.orange[50],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: colors.orange[600]
                }}>🌡️</span>
                Climate Impact
              </h3>
              <div style={{ 
                borderRadius: "12px", 
                backgroundColor: colors.orange[50],
                padding: "24px"
              }}>
                <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.7", color: colors.slate[700] }}>{narrative.climateImpact}</p>
              </div>
            </div>
          )}

          {/* Conservation Actions */}
          {narrative.actions && (
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ 
                marginBottom: "12px", 
                display: "flex", 
                alignItems: "center", 
                gap: "8px",
                fontSize: "20px", 
                fontWeight: "700", 
                color: colors.slate[700]
              }}>
                <span style={{ 
                  width: "32px", 
                  height: "32px", 
                  borderRadius: "50%", 
                  backgroundColor: colors.emerald[100],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: colors.emerald[600]
                }}>🛡️</span>
                Conservation Actions
              </h3>
              <div style={{ 
                borderRadius: "12px", 
                backgroundColor: colors.emerald[50],
                padding: "24px"
              }}>
                <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.7", color: colors.slate[700] }}>{narrative.actions}</p>
              </div>
            </div>
          )}
        </div>

        {/* Research Notes */}
        {narrative.scratchpadNotes && (
          <>
            <div style={{ 
              borderBottom: `2px dashed ${colors.slate[200]}`, 
              margin: "32px 0" 
            }} />
            <div style={{ padding: "48px" }}>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "12px",
                borderBottom: `2px solid ${colors.sky[500]}`,
                paddingBottom: "16px",
                marginBottom: "32px"
              }}>
                <div style={{ 
                  width: "40px", 
                  height: "40px", 
                  borderRadius: "50%", 
                  backgroundColor: colors.sky[500],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  color: "#ffffff"
                }}>
                  📝
                </div>
                <h2 style={{ fontSize: "30px", fontWeight: "700", color: colors.slate[800] }}>Research Notes</h2>
              </div>

              <div style={{ 
                borderRadius: "12px", 
                border: `2px dashed ${colors.sky[500]}40`,
                backgroundColor: colors.sky[50],
                padding: "24px"
              }}>
                <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.7", color: colors.slate[700] }}>
                  {narrative.scratchpadNotes}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Divider */}
        <div style={{ 
          borderBottom: `2px dashed ${colors.slate[200]}`, 
          margin: "32px 0" 
        }} />

        {/* Conclusion */}
        <div style={{ padding: "48px" }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "12px",
            borderBottom: `2px solid ${colors.teal[500]}`,
            paddingBottom: "16px",
            marginBottom: "32px"
          }}>
            <div style={{ 
              width: "40px", 
              height: "40px", 
              borderRadius: "50%", 
              backgroundColor: colors.teal[500],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              color: "#ffffff"
            }}>
              ✨
            </div>
            <h2 style={{ fontSize: "30px", fontWeight: "700", color: colors.slate[800] }}>Conclusion</h2>
          </div>

          <div style={{ 
            borderRadius: "16px", 
            background: `linear-gradient(135deg, ${colors.slate[50]}, ${colors.slate[100]})`,
            padding: "32px"
          }}>
            <p style={{ marginBottom: "24px", fontSize: "18px", lineHeight: "1.7", color: colors.slate[700] }}>
              This Endangered Animal Index (EAI) analysis of the <strong>{species.name}</strong> reveals 
              a conservation status of <strong style={{ color: scoreInfo.color }}>{scoreInfo.label}</strong> with 
              a score of <strong>{result.score}/1000</strong>.
            </p>
            
            <p style={{ marginBottom: "24px", fontSize: "18px", lineHeight: "1.7", color: colors.slate[700] }}>
              {result.annualBirthRate > result.annualDeclineRate ? (
                <>
                  The population shows a positive growth trend with births exceeding decline. However, 
                  continued monitoring and conservation efforts are essential to maintain this trajectory.
                </>
              ) : (
                <>
                  The population is declining faster than it can reproduce, indicating an urgent need for 
                  conservation intervention. Without significant action, this species faces a serious threat 
                  of extinction.
                </>
              )}
            </p>

            <div style={{ 
              marginTop: "32px", 
              borderRadius: "12px", 
              backgroundColor: "#ffffff",
              padding: "24px",
              textAlign: "center",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
              <p style={{ 
                fontSize: "12px", 
                fontWeight: "500", 
                textTransform: "uppercase", 
                letterSpacing: "0.1em",
                color: colors.slate[400]
              }}>Final EAI Score</p>
              <p style={{ 
                margin: "8px 0", 
                fontFamily: "monospace",
                fontSize: "60px", 
                fontWeight: "900", 
                color: scoreInfo.color
              }}>
                {result.score}
              </p>
              <p style={{ fontSize: "18px", fontWeight: "600", color: scoreInfo.color }}>
                {result.tippingPointLabel}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div style={{ 
            marginTop: "48px", 
            borderTop: `1px solid ${colors.slate[200]}`,
            paddingTop: "24px",
            textAlign: "center"
          }}>
            <p style={{ fontSize: "14px", color: colors.slate[500] }}>
              Report generated on {new Date().toLocaleDateString("en-US", { 
                year: "numeric", 
                month: "long", 
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </p>
            <p style={{ marginTop: "8px", fontSize: "12px", color: colors.slate[400] }}>
              Endangered Animal Tracker • Conservation Education Platform
            </p>
          </div>
        </div>
      </div>
    );
  }
);

ExportReport.displayName = "ExportReport";
