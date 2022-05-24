const compose =
  (...fcs) =>
  (...args) => {
    if (fcs.length === 0) throw Error("No functions were provided");
    if (fcs.length === 1) return fcs[0](...args);
    return fcs
      .slice(0, -1)
      .reduceRight((res, x) => x(res), fcs[fcs.length - 1](...args));
  };

module.exports = compose;
