//
//  routes.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import express from 'express';
import { RoutesController } from './RoutesController';
import { ComplianceController } from './ComplianceController';
import { BankingController } from './BankingController';
import { PoolingController } from './PoolingController';

// Use cases
import { ComputeComparisonUseCase } from '../../../core/application/ComputeComparisonUseCase';
import { ComputeComplianceBalanceUseCase } from '../../../core/application/ComputeComplianceBalanceUseCase';
import { BankSurplusUseCase } from '../../../core/application/BankSurplusUseCase';
import { ApplyBankedUseCase } from '../../../core/application/ApplyBankedUseCase';
import { CreatePoolUseCase } from '../../../core/application/CreatePoolUseCase';

// Repositories
import { RouteRepository } from '../../outbound/postgres/RouteRepository';
import { ComplianceRepository } from '../../outbound/postgres/ComplianceRepository';
import { BankingRepository } from '../../outbound/postgres/BankingRepository';
import { PoolingRepository } from '../../outbound/postgres/PoolingRepository';

const router = express.Router();

// Initialize repositories
const routeRepo = new RouteRepository();
const complianceRepo = new ComplianceRepository();
const bankingRepo = new BankingRepository();
const poolingRepo = new PoolingRepository();

// Initialize use cases
const computeComparisonUseCase = new ComputeComparisonUseCase();
const computeCBUseCase = new ComputeComplianceBalanceUseCase();
const bankSurplusUseCase = new BankSurplusUseCase();
const applyBankedUseCase = new ApplyBankedUseCase();
const createPoolUseCase = new CreatePoolUseCase();

// Initialize controllers
const routesController = new RoutesController(routeRepo, computeComparisonUseCase);
const complianceController = new ComplianceController(complianceRepo, computeCBUseCase);
const bankingController = new BankingController(bankingRepo, bankSurplusUseCase, applyBankedUseCase);
const poolingController = new PoolingController(poolingRepo, createPoolUseCase);

// Routes
router.get('/routes', routesController.getAllRoutes);
router.post('/routes/:routeId/baseline', routesController.setBaseline);
router.get('/routes/comparison', routesController.getComparison);

router.get('/compliance/cb', complianceController.getComplianceBalance);
router.post('/compliance/cb', complianceController.computeAndSaveCB);
router.get('/compliance/adjusted-cb', complianceController.getAdjustedCB);

router.post('/banking/bank', bankingController.bankSurplus);
router.post('/banking/apply', bankingController.applyBanked);
router.get('/banking/records', bankingController.getRecords);

router.post('/pools', poolingController.createPool);
router.get('/pools', poolingController.getPools);

export default router;
