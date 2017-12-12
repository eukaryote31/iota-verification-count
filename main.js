
var iota = new IOTA({
  'provider': 'https://nodes.iota.cafe:443'
})

var threshold = 1000
var running = false
$("#status-btn").click(() => {
  if (running) {
    return
  }
  running = true
  $("#status-btn").prop('disabled', true)
  $("#result-box").html('Starting search, this could take a few minutes..')
  $("#loading-spinner").html('<i class="fa fa-circle-o-notch fa-spin" style="font-size:24px"></i>')
  iota.api.getNodeInfo((err, res) => {
    tocheck = [$("#txhash").val()]
    recursive_check(0, tocheck)
  })
})

function recursive_check(i, hashes) {
  iota.api.findTransactionObjects({'approvees': hashes}, (err, res) => {
    if (err) {
      $("#result-box").html(err)
      $("#loading-spinner").html('')
      running = false
      throw err
    }

    if (res == undefined || i > threshold) {
      $("#loading-spinner").html('')
      $("#result-box").html(`${i > threshold ? "More than " + i : i} transactions indirectly verify this one. ${i > threshold ? '(We stopped because it might take a very long time to finish)' : ''}`)
      $("#status-btn").prop('disabled', false)
      running = false
    }

    txhashes = [for (x of res) x.hash]
    i += txhashes.length

    $("#result-box").html(`Found ${i} transactions that indirectly verify this one so far...`)

    console.log(txhashes)

    recursive_check(i, txhashes)

  })
}
