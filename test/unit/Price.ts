// imports
import * as chai from "chai"
import { BITBOX } from "../../lib/BITBOX"
import { Price } from "../../lib/Price"
import axios from "axios"
import * as sinon from "sinon"

// consts
const bitbox: BITBOX = new BITBOX()
const assert: Chai.AssertStatic = chai.assert

describe("#Price", (): void => {
  let sandbox: any
  beforeEach(() => (sandbox = sinon.sandbox.create()))
  afterEach(() => sandbox.restore())

  describe("#PriceConstructor", (): void => {
    it("should create instance of Price", (): void => {
      const price: Price = new Price()
      assert.equal(price instanceof Price, true)
    })
  })

  describe("#current", (): void => {
    describe("#single currency", (): void => {
      it("should get current price for single currency", async () => {
        // Mock out data for unit test, to prevent live network call.
        const rate: any = 265.6074
        const time: any = 1583781799
        const name: any = "US Dollar"
        const currency: any = "USD"

        const resolved: any = new Promise(r =>
          r({ data: { [currency]: { name, time, rate } } })
        )

        sandbox.stub(axios, "get").returns(resolved)

        const result = await bitbox.Price.current(currency)
        //console.log(`result: ${JSON.stringify(result, null, 2)}`)

        assert.isNumber(result)
      })
    })
  })
})
