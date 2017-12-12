
var iota = new IOTA({
  'provider': 'https://nodes.iota.cafe:443'
})

var threshold = 10000
$("#status-btn").click(() => {
  $("#status-btn").prop('disabled', true)
  $("#result-box").html('Starting search, this could take a few minutes..')
  $("#loading-spinner").html('<i class="fa fa-circle-o-notch fa-spin" style="font-size:24px"></i>')
  iota.api.getNodeInfo((err, res) => {
    tocheck = [$("#txhash").val()]
    totalcnt = recursive_check(0, tocheck)
  })
})

function recursive_check(i, hashes) {
  if (hashes.length == 0) {
    return i
  }

  iota.api.findTransactionObjects({'approvees': hashes}, (err, res) => {
    if (err) {
      $("#result-box").html(err)
      $("#loading-spinner").html('')
      throw err
    }

    if (res == undefined || i > threshold) {
      $("#loading-spinner").html('')
      $("#result-box").html(`${totalcnt > threshold ? "More than " + totalcnt : totalcnt} transactions indirectly verify this one.`)
      $("#status-btn").prop('disabled', false)
      return i
    }

    txhashes = [for (x of res) x.hash]
    i += txhashes.length

    $("#result-box").html(`Found ${i == undefined ? 0 : i} transactions that indirectly verify this one so far...`)

    console.log(txhashes)

    return recursive_check(i, txhashes)

  })
}
