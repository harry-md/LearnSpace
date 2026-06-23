done = function(summary, latency, requests)
	io.write("\nCustom Latency Percentiles:\n")
	local percentiles = { 50, 75, 90, 95, 99 }
	for _, pct in ipairs(percentiles) do
		local value = latency:percentile(pct) / 1000.0
		io.write(string.format(" p%g: %.2fms\n", pct, value))
	end
end
