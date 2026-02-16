"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
process.env.API_KEY = 'test-key';
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("../modules/job/routes"));
const apiKeyAuth_1 = require("../middleware/apiKeyAuth");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(apiKeyAuth_1.apiKeyAuth, routes_1.default);
describe('API Key Auth', () => {
    it('should reject requests without API key', async () => {
        const res = await (0, supertest_1.default)(app).post('/submit').send({ type: 'test', payload: {} });
        expect(res.status).toBe(401);
    });
    it('should accept requests with valid API key', async () => {
        const validJob = { name: 'Test Job', priority: 1 };
        const res = await (0, supertest_1.default)(app)
            .post('/submit')
            .send(validJob)
            .set('x-api-key', 'test-key');
        expect(res.status).not.toBe(401);
    });
});
