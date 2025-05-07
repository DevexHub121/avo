import React from "react";
import { Button, ButtonGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { LuPencilLine } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import { MdPublishedWithChanges } from "react-icons/md";
import { MdOutlineUnpublished } from "react-icons/md";
const OfferComponent = ({
  handleShowOffer,
  offersData,
  formatDateTime,
  handleViewOffer,
  handleShowOfferModal,
  handleEditOffer,
  handlePublishUnpublishOffer,
}) => {
  return (
    <div className="container table-w">
      <div className="px-4 py-4 mt-5 bg-white rounded shadow-sm">
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <div className="">
            <h3 className="mb-0 fw-semibold">Offers</h3>
          </div>

          <Button
            variant="outline-dark"
            className="mx-2 text-white border-white btn-success"
            onClick={() => handleShowOffer("create-offer")}
          >
            {" "}
            Create Offer +
          </Button>
        </div>
        <div className="mt-3 table-responsive">
          <table className="table table-hover">
            <thead className="table-light table-header">
              <tr>
                <th>Title</th>
                <th>Max usage</th>
                <th>Price</th>
                <th>Discount%</th>
                <th>Start date</th>
                <th>End date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {offersData?.offers?.map((item, idx) => (
                <tr key={idx}>
                  <td className="align-middle">{item.title}</td>
                  <td className="align-middle">{item.max_usage}</td>
                  <td className="align-middle">${item.price}</td>
                  <td className="align-middle">{item.discount_percentage}%</td>
                  <td className="align-middle">{formatDateTime(item.start_date)}</td>
                  <td className="align-middle">{formatDateTime(item.end_date)}</td>
                  <td className="align-middle text-end">
                    <ButtonGroup size="sm" aria-label="Offer Actions">
                      <div className="gap-3 d-inline-flex align-items-center">
                        {item.is_published === 0 ? (
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Publish Offer</Tooltip>}
                          >
                            <span
                              className="icon-hover"
                              onClick={() =>
                                handlePublishUnpublishOffer(item, "publish-unpublish")
                              }
                            >
                              <MdPublishedWithChanges />
                            </span>
                          </OverlayTrigger>
                        ) : (
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Unpublish Offer</Tooltip>}
                          >
                            <span
                              className="icon-hover"
                              onClick={() =>
                                handlePublishUnpublishOffer(
                                  item,
                                  "publish-unpublish"
                                )
                              }
                            >
                              {item.is_published ? (
                                <MdOutlineUnpublished size={20} />
                              ) : (
                                <MdPublishedWithChanges size={20} />
                              )}
                            </span>
                          </OverlayTrigger>
                        )}

                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>View Offer</Tooltip>}
                        >
                          <span
                            className="icon-hover"
                            onClick={() => handleViewOffer(item, "view-offer")}
                          >
                            <FaEye size={18} />
                          </span>
                        </OverlayTrigger>

                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Edit Offer</Tooltip>}
                        >
                          <span
                            className="icon-hover"
                            onClick={() => handleEditOffer(item, "edit")}
                          >
                            <LuPencilLine size={20} />
                          </span>
                        </OverlayTrigger>

                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Delete Offer</Tooltip>}
                        >
                          <span
                            className="icon-hover text-danger"
                            onClick={() => handleShowOfferModal(item, "delete")}
                          >
                            <MdDelete size={20} />
                          </span>
                        </OverlayTrigger>
                      </div>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OfferComponent;
