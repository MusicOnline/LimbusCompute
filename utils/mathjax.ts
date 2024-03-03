export function typesetMathJax(elements: HTMLElement[] | null = null) {
  // @ts-expect-error
  if (!window?.MathJax) return
  // @ts-expect-error
  window.MathJax.startup.promise = MathJax.startup.promise
    // @ts-expect-error
    .then(() => MathJax.typesetPromise(elements))
    // @ts-expect-error
    .catch((err) => console.log("Typeset failed: " + err.message))
  // @ts-expect-error
  return MathJax.startup.promise
}

export function getMatrixMarkup(
  matrix: number[][],
  isBmatrix: boolean = false
) {
  let matrixHtml = "\\begin{bmatrix}"

  matrix.forEach((row, i) => {
    matrixHtml +=
      row
        .map((prob, j) => {
          const valueString = prob.toFixed(2)
          if (isBmatrix && i === 0 && j === 0)
            return `\\color{green}{${valueString}}`
          if (isBmatrix && i === 0 && j === 1)
            return `\\color{red}{${valueString}}`
          if (valueString === "0.00") return "\\color{lightgray}{0.00}"
          return valueString
        })
        .join(" & ") + "\\\\"
  })

  matrixHtml += "\\end{bmatrix}"
  return matrixHtml
}
