INSERT INTO APP_USER VALUES ('1', TO_DATE('01-70-01', 'DD-RR-MM'), 'yashdsaraf@gmail.com', 'Yash D. Saraf', '7676aaafb027c825bd9abab78b234070e702752f625b752e55e55b48e607e358', 'ADMIN', 'yashdsaraf');
INSERT INTO APP_USER VALUES ('2', TO_DATE('01-70-01', 'DD-RR-MM'), 'raeesmulla97@gmail.com', 'Raees R. Mulla', '7676aaafb027c825bd9abab78b234070e702752f625b752e55e55b48e607e358', 'ADMIN', 'raeesmulla97');
INSERT INTO APP_USER VALUES ('3', TO_DATE('01-70-01', 'DD-RR-MM'), 'shaggi199712@gmail.com', 'Sachin S. Negi', '7676aaafb027c825bd9abab78b234070e702752f625b752e55e55b48e607e358', 'ADMIN', 'shaggi199712');
INSERT INTO APP_USER VALUES ('4', TO_DATE('24-17-11', 'DD-RR-MM'), 'johndoe123@gmail.com', 'John Doe', 'dcb694aa0322f143ed970e275c807bf123bd5db4f73140b94ccc757f42dc8043', 'USER', 'johndoe');
INSERT INTO APP_USER VALUES ('5', TO_DATE('22-17-06', 'DD-RR-MM'), 'janedoe123@gmail.com', 'Jane Doe', 'dcb694aa0322f143ed970e275c807bf123bd5db4f73140b94ccc757f42dc8043', 'USER', 'janedoe');
INSERT INTO APP_USER VALUES ('6', TO_DATE('01-17-03', 'DD-RR-MM'), 'michaelt@gmail.com', 'Michael Thomas', 'dcb694aa0322f143ed970e275c807bf123bd5db4f73140b94ccc757f42dc8043', 'USER', 'michaelt');
INSERT INTO APP_USER VALUES ('7', TO_DATE('04-17-09', 'DD-RR-MM'), 'dan.taylor@gmail.com', 'Dan Taylor', 'dcb694aa0322f143ed970e275c807bf123bd5db4f73140b94ccc757f42dc8043', 'USER', 'dantaylor123');
INSERT INTO APP_USER VALUES ('8', TO_DATE('19-18-01', 'DD-RR-MM'), 'max.oliver@gmail.com', 'Max Oliver', '6a449eeeba4d6259c7035a0abc1a5ca52a2a568b362d514be033e4c6c49da7c2', 'DEVELOPER', 'maxoliver89');
INSERT INTO APP_USER VALUES ('9', TO_DATE('14-17-07', 'DD-RR-MM'), 'nicoladyer93@gmail.com', 'Nicola Dyer', '6a449eeeba4d6259c7035a0abc1a5ca52a2a568b362d514be033e4c6c49da7c2', 'DEVELOPER', 'nicola.dyer93');

INSERT INTO APP_ADMIN VALUES ('10', '1');
INSERT INTO APP_ADMIN VALUES ('11', '2');
INSERT INTO APP_ADMIN VALUES ('12', '3');

INSERT INTO DEVELOPER VALUES ('13', '', '8');
INSERT INTO DEVELOPER VALUES ('14', '', '9');

INSERT INTO PLUGIN VALUES ('15', TO_DATE('15-17-08', 'DD-RR-MM'), 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.', 'Java', 'file', 'APP', TO_DATE('15-18-01', 'DD-RR-MM'), '10', '13');
INSERT INTO PLUGIN VALUES ('16', TO_DATE('21-17-09', 'DD-RR-MM'), 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.', 'Python', 'file', 'APP', TO_DATE('18-18-01', 'DD-RR-MM'), '12', '14');
INSERT INTO PLUGIN VALUES ('17', TO_DATE('22-17-10', 'DD-RR-MM'), 'Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Ruby', 'file', 'APP', TO_DATE('24-18-01', 'DD-RR-MM'), '11', '13');
INSERT INTO PLUGIN VALUES ('18', TO_DATE('04-17-11', 'DD-RR-MM'), 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'PHP', 'file', 'APP', TO_DATE('15-18-01', 'DD-RR-MM'), '10', '13');
INSERT INTO PLUGIN VALUES ('19', TO_DATE('09-17-12', 'DD-RR-MM'), 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.', 'Bash', 'file', 'PEN', TO_DATE('18-18-01', 'DD-RR-MM'), '12', '14');
INSERT INTO PLUGIN VALUES ('20', TO_DATE('17-17-11', 'DD-RR-MM'), 'Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'C++', 'file', 'PEN', TO_DATE('24-18-01', 'DD-RR-MM'), '11', '14');
drop sequence hibernate_sequence;
create sequence hibernate_sequence start with 21 increment by 1;
