<script>
  export let data;
  $: listings = data?.listings || [];
</script>

<div class="intelligence-page container mx-auto p-6">
  <div class="header mb-8">
    <h1 class="text-3xl font-bold text-gray-900 flex items-center gap-3">
      <span class="text-green-600">🧠</span> Waste Intelligence Engine
    </h1>
    <p class="text-gray-600 mt-2">
      Intelligent agricultural waste utilization matching, suitability scoring, multi-farmer supply aggregation, and value optimization.
    </p>
  </div>

  {#if listings.length === 0}
    <div class="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
      <p class="text-gray-500">No agricultural waste listings available for analysis.</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each listings as item}
        <div class="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="font-bold text-lg text-gray-900">{item.title}</h3>
                <p class="text-xs text-gray-500">{item.quantity} {item.unit || 'Tons'} • {item.location}</p>
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                WSS: {item.suitability?.wssScore || 85}/100
              </span>
            </div>

            <div class="space-y-3 text-sm my-4 border-t border-b border-gray-100 py-3">
              <div class="flex justify-between">
                <span class="text-gray-500">Quality Grade:</span>
                <span class="font-medium text-gray-800">{item.quality?.grade || 'Good'} ({item.quality?.score || 80}/100)</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Suitability:</span>
                <span class="font-medium text-green-700">{item.suitability?.categoryLabel || 'Suitable'}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Recommended Use:</span>
                <span class="font-semibold text-emerald-600">{item.recommendations?.[0]?.application_name || 'Composting'}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Est. Value Uplift:</span>
                <span class="font-bold text-gray-900">₹{item.valueOpt?.potentialUtilizationValue?.toLocaleString('en-IN') || '0'}</span>
              </div>
            </div>
          </div>

          <a href="#waste/{item.id}" class="w-full text-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors">
            View Detailed Intelligence
          </a>
        </div>
      {/each}
    </div>
  {/if}
</div>
